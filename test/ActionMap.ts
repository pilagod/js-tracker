import * as chai from 'chai'
import ActionMap from '../src/tracker/ActionMap'
import ActionTypes from '../src/tracker/ActionTypes'

const expect = chai.expect

describe('ActionMap', () => {
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

  describe('getActionType', () => {
    describe('without action tag', () => {
      it('should return correct action type', () => {
        expect(
          ActionMap.getActionType('Element', 'id')
        ).to.equal(ActionTypes.Attribute)
      })

      it('should return action type None given invalid action', () => {
        expect(
          ActionMap.getActionType('Element', 'innerText')
        ).to.equal(ActionTypes.None)
      })

      it('should return action type None given invalid target', () => {
        expect(
          ActionMap.getActionType('InvalidTarget', 'InvalidAction')
        ).to.equal(ActionTypes.None)
      })

      describe('CSSStyleDeclaration', () => {
        it('should always return action type Style', () => {
          expect(
            ActionMap.getActionType('CSSStyleDeclaration', 'color')
          ).to.equal(ActionTypes.Style)
          expect(
            ActionMap.getActionType('CSSStyleDeclaration', 'border')
          ).to.equal(ActionTypes.Style)
        })
      })

      describe('DOMStringMap', () => {
        it('should always return action type Attribute', () => {
          expect(
            ActionMap.getActionType('DOMStringMap', 'id')
          ).to.equal(ActionTypes.Attribute)
          expect(
            ActionMap.getActionType('DOMStringMap', 'style')
          ).to.equal(ActionTypes.Attribute)
        })
      })
    })

    describe('with action tag', () => {
      describe('Attr', () => {
        it('should return action type Attribute on default', () => {
          expect(
            ActionMap.getActionType('Element', 'setAttribute', 'id')
          ).to.equal(ActionTypes.Attribute)
        })

        it('should return action type Style given action tag \'class\'', () => {
          expect(
            ActionMap.getActionType('Element', 'setAttributeNode', 'class')
          ).to.equal(ActionTypes.Style)
        })

        it('should return action type Style given action tag \'style\'', () => {
          expect(
            ActionMap.getActionType('Attr', 'value', 'style')
          ).to.equal(ActionTypes.Style)
        })
      })

      describe('DOMTokenList', () => {
        it('should return action type Style given action tag \'classList\'', () => {
          expect(
            ActionMap.getActionType('DOMTokenList', 'add', 'classList')
          ).to.equal(ActionTypes.Style)
        })
      })
    })
  })
})