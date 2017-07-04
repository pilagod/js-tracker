import * as chai from 'chai'
import ActionMap from '../src/tracker/ActionMap'

const expect = chai.expect

describe('tracker\'s coverage', function () {
  describe('property setter coverage', function () {
    const PROXY_TARGETS: object = {
      'CSSStyleDeclaration': true,
      'DOMStringMap': true
    }
    const EXCLUDE_ACTIONS: object = {
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
    ActionMap.visit(function (target, actionMap) {
      if (!isProxyTargets(target)) {
        const proto = window[target].prototype

        it(`should track ${target} all property setters`, function () {
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

  describe('manipulation method coverage', function () {
    function isManipulationMethod(method) {
      return /^(set|add|append|prepend|insert|remove|replace|toggle)/.test(method)
    }
    ActionMap.visit(function (target, actionMap) {
      const proto = window[target].prototype

      it(`should track ${target} all manipulation methods`, function () {
        Object.getOwnPropertyNames(proto).forEach((prop) => {
          if (isManipulationMethod(prop)) {
            expect(actionMap).to.have.property(prop)
          }
        })
      })
    })
  })
})
