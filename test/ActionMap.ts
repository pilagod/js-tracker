import { expect } from 'chai'

import ActionType from '../src/tracker/public/ActionType'
import ActionMap from '../src/tracker/private/ActionMap'

describe('ActionMap', () => {
  describe('filterActionType', () => {
    describe('without action tag', () => {
      it('should return correct action type', () => {
        expect(
          ActionMap.filterActionType('Element', 'id')
        ).to.equal(ActionType.Attr)
      })

      it('should return action type None given invalid action', () => {
        expect(
          ActionMap.filterActionType('Element', 'innerText')
        ).to.equal(ActionType.None)
      })

      it('should return action type None given invalid target', () => {
        expect(
          ActionMap.filterActionType(<any>'InvalidTarget', 'InvalidAction')
        ).to.equal(ActionType.None)
      })

      describe('CSSStyleDeclaration', () => {
        it('should always return action type Style', () => {
          expect(
            ActionMap.filterActionType('CSSStyleDeclaration', 'color')
          ).to.equal(ActionType.Style)
          expect(
            ActionMap.filterActionType('CSSStyleDeclaration', 'border')
          ).to.equal(ActionType.Style)
        })
      })

      describe('DOMStringMap', () => {
        it('should always return action type Attr', () => {
          expect(
            ActionMap.filterActionType('DOMStringMap', 'id')
          ).to.equal(ActionType.Attr)
          expect(
            ActionMap.filterActionType('DOMStringMap', 'style')
          ).to.equal(ActionType.Attr)
        })
      })
    })

    describe('with action tag', () => {
      describe('Attr', () => {
        it('should return action type Attr on default', () => {
          expect(
            ActionMap.filterActionType('Element', 'setAttribute', 'id')
          ).to.equal(ActionType.Attr)
        })

        it('should return action type Style given action tag \'class\'', () => {
          expect(
            ActionMap.filterActionType('Element', 'setAttributeNode', 'class')
          ).to.equal(ActionType.Style)
        })

        it('should return action type Style given action tag \'style\'', () => {
          expect(
            ActionMap.filterActionType('Attr', 'value', 'style')
          ).to.equal(ActionType.Style)
        })
      })

      describe('DOMTokenList', () => {
        it('should return action type Style given action tag \'classList\'', () => {
          expect(
            ActionMap.filterActionType('DOMTokenList', 'add', 'classList')
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
      expect(ActionMap.has('InvalidTarget', 'InvalidAction')).to.be.false
    })
  })

  describe('visit', () => {
    it('should iterate all tracked target in ActionMap', () => {
      const expected = [
        'HTMLElement'
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