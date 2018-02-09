import { expect } from 'chai'

import ActionType from '../../../src/tracker/public/ActionType'
import ActionMap from '../../../src/tracker/private/ActionMap'
import { SymbolWhich } from '../../../src/tracker/private/Symbols'

describe('ActionMap', () => {
  describe('coverage', () => {
    describe('property setter coverage', () => {
      const PROXY_TARGETS = {
        'CSSStyleDeclaration': true,
        'DOMStringMap': true
      }
      const EXCLUDE_ACTIONS = {
        'attributes': true,
        'classList': true,
        'dataset': true,
        'style': true
      }
      function isProxyTargets(ctr) {
        return PROXY_TARGETS.hasOwnProperty(ctr)
      }
      function isExcludedActions(prop) {
        return EXCLUDE_ACTIONS.hasOwnProperty(prop)
      }
      ActionMap.visit((target, actionMap) => {
        if (!isProxyTargets(target)) {
          const proto = window[target].prototype

          it(`should track ${target} all property setters`, () => {
            Object.getOwnPropertyNames(proto).forEach((action) => {
              const descriptor = Object.getOwnPropertyDescriptor(proto, action)

              if (descriptor.set && !isExcludedActions(action)) {
                expect(actionMap).to.have.property(action)
              }
            })
          })
        }
      })
    })

    describe('manipulation method coverage', () => {
      function isManipulationMethod(method) {
        return /^(set|add|append|prepend|insert|remove|replace|toggle)/.test(method)
      }
      ActionMap.visit((target, actionMap) => {
        const proto = window[target].prototype

        it(`should track ${target} all manipulation methods`, () => {
          Object.getOwnPropertyNames(proto).forEach((prop) => {
            if (isManipulationMethod(prop)) {
              expect(actionMap).to.have.property(prop)
            }
          })
        })
      })
    })
  })

  describe('getActionType', () => {
    describe('normal actions', () => {
      it('should return correct action type', () => {
        expect(
          ActionMap.getActionType({
            caller: null,
            target: 'Element',
            action: 'id'
          })
        ).to.equal(ActionType.Attr)
      })

      it('should return action type None given invalid action', () => {
        expect(
          ActionMap.getActionType({
            caller: null,
            target: 'Element',
            action: 'innerText'
          })
        ).to.equal(ActionType.None)
      })

      it('should return action type None given invalid target', () => {
        expect(
          ActionMap.getActionType({
            caller: null,
            target: <any>'InvalidTarget',
            action: 'InvalidAction'
          })
        ).to.equal(ActionType.None)
      })

      describe('CSSStyleDeclaration', () => {
        it('should return action type Style', () => {
          expect(
            ActionMap.getActionType({
              caller: null,
              target: 'CSSStyleDeclaration',
              action: 'color'
            })
          ).to.equal(ActionType.Style)
        })
      })

      describe('DOMStringMap', () => {
        it('should always return action type Attr', () => {
          expect(
            ActionMap.getActionType({
              caller: null,
              target: 'DOMStringMap',
              action: 'id'
            })
          ).to.equal(ActionType.Attr)
          expect(
            ActionMap.getActionType({
              caller: null,
              target: 'DOMStringMap',
              action: 'style'
            })
          ).to.equal(ActionType.Attr)
        })
      })
    })

    describe('composite actions', () => {
      describe('Element', () => {
        it('should return action type Attr given id attribute is set', () => {
          expect(
            ActionMap.getActionType({
              caller: null,
              target: 'Element',
              action: 'setAttribute',
              args: ['id']
            })
          ).to.equal(ActionType.Attr)
        })

        it('should return action type Style given style attribute is set', () => {
          expect(
            ActionMap.getActionType({
              caller: null,
              target: 'Element',
              action: 'setAttribute',
              args: ['style']
            })
          ).to.equal(ActionType.Style)
        })

        it('should return action type Attr given attr\'s name is \'id\'', () => {
          expect(
            ActionMap.getActionType({
              caller: null,
              target: 'Element',
              action: 'setAttributeNode',
              args: [document.createAttribute('id')]
            })
          ).to.equal(ActionType.Attr)
        })

        it('should return action type Style given attr\'s name is \'class\'', () => {
          expect(
            ActionMap.getActionType({
              caller: null,
              target: 'Element',
              action: 'setAttributeNode',
              args: [document.createAttribute('class')]
            })
          ).to.equal(ActionType.Style)
        })
      })

      describe('Attr', () => {
        it('should return action type Attr given attr\'s name is \'id\'', () => {
          expect(
            ActionMap.getActionType({
              caller: document.createAttribute('id'),
              target: 'Attr',
              action: 'value'
            })
          ).to.equal(ActionType.Attr)
        })

        it('should return action type Style given attr\'s name is \'style\'', () => {
          expect(
            ActionMap.getActionType({
              caller: document.createAttribute('style'),
              target: 'Attr',
              action: 'value'
            })
          ).to.equal(ActionType.Style)
        })
      })

      describe('DOMTokenList', () => {
        it('should return action type Style given caller is \'classList\'', () => {
          const div = document.createElement('div')

          div.classList[SymbolWhich] = 'classList'

          expect(
            ActionMap.getActionType({
              caller: div.classList,
              target: 'DOMTokenList',
              action: 'add'
            })
          ).to.equal(ActionType.Style)
        })
      })
    })
  })

  describe('has', () => {
    it('should return true given valid target and action', () => {
      expect(ActionMap.has('HTMLElement', 'innerText')).to.be.true
      expect(ActionMap.has('Element', 'id')).to.be.true
    })

    it('should return false given invalid action', () => {
      expect(ActionMap.has('HTMLElement', 'id')).to.be.false
      expect(ActionMap.has('Element', 'innerText')).to.be.false
    })

    it('should return false given invalid target', () => {
      expect(ActionMap.has(<any>'InvalidTarget', 'InvalidAction')).to.be.false
    })
  })

  describe('visit', () => {
    it('should iterate all tracked target in ActionMap', () => {
      const expected = [
        'HTMLElement'
        , 'SVGElement'
        , 'Element'
        , 'Node'
        , 'EventTarget'
        , 'Attr'
        , 'CSSStyleDeclaration'
        , 'DOMStringMap'
        , 'DOMTokenList'
        , 'NamedNodeMap'
      ].sort()
      const got = []

      ActionMap.visit((target: Target) => {
        got.push(target)
      })
      got.sort()

      expect(got).to.deep.equal(expected)
    })
  })
})