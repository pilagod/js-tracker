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

    it('should return false given invalid target or action', () => {
      expect(ActionMap.has('HTMLElement', 'id')).to.be.false
      expect(ActionMap.has('Element', 'innerText')).to.be.false
      expect(ActionMap.has('InvalidTarget', 'InvalidAction')).to.be.false
    })
  })

  describe('getActionType', () => {
    describe('no action tag', () => {
      it('should return proper action type', () => {
        const type = ActionMap.getActionType('Element', 'id')

        expect(type).to.equal(ActionTypes.Attribute)
      })

      it('should return action type None given invalid target or action', () => {
        const type1 = ActionMap.getActionType('Element', 'InvalidAction')
        const type2 = ActionMap.getActionType('InvalidTarget', 'InvalidAction')

        expect(type1).to.equal(ActionTypes.None)
        expect(type2).to.equal(ActionTypes.None)
      })

      describe('CSSStyleDeclaration', () => {
        it('should always return action type Style', () => {
          const type = ActionMap.getActionType('CSSStyleDeclaration', 'color')

          expect(type).to.equal(ActionTypes.Style)
        })
      })

      describe('DOMStringMap', () => {
        it('should always return action type Attribute', () => {
          const type = ActionMap.getActionType('DOMStringMap', 'data')

          expect(type).to.equal(ActionTypes.Attribute)
        })
      })
    })

    describe('action tag', () => {
      describe('Attr', () => {
        it('should return action type Attribute on default', () => {
          const type = ActionMap.getActionType('Element', 'setAttribute', 'id')

          expect(type).to.equal(ActionTypes.Attribute)
        })

        it('should return action type Style given action tag \'class\'', () => {
          const type = ActionMap.getActionType('Element', 'setAttributeNode', 'class')

          expect(type).to.equal(ActionTypes.Style)
        })

        it('should return action type Style given action tag \'style\'', () => {
          const type = ActionMap.getActionType('Attr', 'value', 'style')

          expect(type).to.equal(ActionTypes.Style)
        })
      })

      describe('DOMTokenList', () => {
        it('should return action type Style given action tag \'classList\'', () => {
          const type = ActionMap.getActionType('DOMTokenList', 'add', 'classList')

          expect(type).to.equal(ActionTypes.Style)
        })
      })
    })
  })
})