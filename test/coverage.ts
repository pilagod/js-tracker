import * as chai from 'chai'
import { ActionTypesMap } from '../src/tracker/ActionTypes'

const expect = chai.expect

const EXCLUDE_PROPS: Object = {
  'attributes': true,
  'classList': true,
  'dataset': true,
  'style': true
}
function isExcludedProp(prop) {
  return EXCLUDE_PROPS.hasOwnProperty(prop)
}
const PROXY_CTRS: Object = {
  'CSSStyleDeclaration': true,
  'DOMStringMap': true
}
function isProxyCtr(ctr) {
  return PROXY_CTRS.hasOwnProperty(ctr)
}

describe('coverage', function () {
  for (let ctr in ActionTypesMap) {
    if (!isProxyCtr(ctr)) {
      const proto = window[ctr].prototype
      const trackProps = ActionTypesMap[ctr]

      it(`should track ${ctr} all property setters`, function () {
        Object.getOwnPropertyNames(proto).forEach((prop) => {
          const descriptor = Object.getOwnPropertyDescriptor(proto, prop)

          if (descriptor.set && !isExcludedProp(prop)) {
            expect(trackProps).to.have.property(prop)
          }
        })
      })
    }
  }
})
