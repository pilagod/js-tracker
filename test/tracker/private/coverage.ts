import { expect } from 'chai'

import ActionMap from '../../../src/tracker/private/ActionMap'

describe('tracker\'s coverage', () => {
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
