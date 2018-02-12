/// <reference path='../../types/ActionTarget.d.ts'/>
/// <reference path='../../types/ActionStore.d.ts'/>

import ActionMap from '../../private/ActionMap'
import MessageBroker from '../../private/MessageBroker'
import OwnerManager from '../../private/OwnerManager'
import ShadowElement from '../../private/ShadowElement'
import { attachAttr, setAttrValue } from '../../private/NativeUtils'
import { SymbolProxy, SymbolWhich } from '../../private/Symbols'
import {
  saveRecordDataTo,
  wrapActionWithSourceMessages
} from '../utils'

export type Decorator = (
  target: Target,
  action: Action,
  actionFunc: (this: ActionTarget, ...args: any[]) => any
) => (this: ActionTarget, ...args: any[]) => any

export const decorators: { [name: string]: Decorator } = {
  general: (target, action, actionFunc) => {
    return function (...args) {
      return wrapActionWithSourceMessages(() => {
        const result = actionFunc.call(this || window, ...args)
        record({ caller: this || window, target, action, args })
        return result
      })
    }
  },

  trigger: (target, action, actionFunc) => {
    return function (...args) {
      return wrapActionWithSourceMessages(() => {
        MessageBroker.stackMessages()
        const result = actionFunc.call(this, ...args)
        MessageBroker.restoreMessages()

        record({ caller: this, target, action })

        return result
      })
    }
  },

  // element.setAttributeNode(...)
  // element.attributes.setNamedItem(...)
  setAttributeNode: (target, action, actionFunc: (attr: Attr) => void) => {
    return function (attr: Attr): void {
      // @NOTE: owner should get before actionFunc call,
      // for no owner attr, it might attach to element after
      // actionFunc call, and cause record to set merge to 
      // the element's trackid instead of undefined from NullOwner
      const owner = OwnerManager.getOwner(attr)
      const attattr = getAttachableAttr(attr)

      return wrapActionWithSourceMessages(() => {
        const result = actionFunc.call(this, attattr)
        record({
          caller: this, target, action, args: [attattr],
          merge: owner.getTrackID()
        })
        return result
      })
    }
  },

  // documemt.createAttribute('...').value = '...'
  value: (target, action, setter: (value: string) => void) => {
    return function (this: Attr, value: string): void {
      if (!OwnerManager.hasOwner(this)) {
        // @TODO: check namespaceURI
        attachAttr(document.createElement(ShadowElement.TagName), this)
      }
      return wrapActionWithSourceMessages(() => {
        const result = setter.call(this, value)
        record({ caller: this, target, action })
        return result
      })
    }
  },

  /* getter */

  // style
  CSSStyleDeclaration: proxyDecorator(<ProxyHandler<CSSStyleDeclaration>>{
    get: function (target, action) {
      // @NOTE: function should bind to target, otherwise its context 
      // will be the Proxy, and throwing Illegal Invocation Error.
      return typeof target[action] === 'function'
        ? target[action].bind(target)
        : target[action]
    },
    set: function (target, action, value) {
      return wrapActionWithSourceMessages(() => {
        target[action] = value
        record({ caller: target, target: 'CSSStyleDeclaration', action })
        return true
      })
    }
  }),

  // dataset
  DOMStringMap: proxyDecorator(<ProxyHandler<DOMStringMap>>{
    set: function (target, action, value) {
      return wrapActionWithSourceMessages(() => {
        target[action] = value
        record({ caller: target, target: 'DOMStringMap', action })
        return true
      })
    }
  }),

  // classList
  DOMTokenList: (_, which, getter: () => DOMTokenList) => {
    return function (this: Element): DOMTokenList {
      const target = <DOMTokenList>getter.call(this)

      if (!OwnerManager.hasOwner(target)) {
        OwnerManager.setOwner(target, this)
      }
      if (!target[SymbolWhich]) {
        // classList, relList, ...
        target[SymbolWhich] = which
      }
      return target
    }
  },

  // attributes
  NamedNodeMap: (_, __, getter: () => NamedNodeMap) => {
    return function (this: Element): NamedNodeMap {
      const target = <NamedNodeMap>getter.call(this)

      if (!OwnerManager.hasOwner(target)) {
        OwnerManager.setOwner(target, this)
      }
      return target
    }
  }
}

function record(info: {
  caller: ActionTarget,
  target: Target,
  action: Action,
  args?: any[],
  merge?: TrackID
}): void {
  // @NOTE: target should not be derived from the type of caller
  // e.g., { caller: HTMLDivElement, target: Element, action: id }
  if (!OwnerManager.hasOwner(info.caller)) {
    // @NOTE: although typescript predefine that caller should be ActionTarget,
    // caller is actually determined in runtime, and it's possible to get invalid 
    // callers, e.g., DocumentFragment, XHRHttpRequst
    return
  }
  saveRecordDataTo(info.caller, ActionMap.getActionType(info), info.merge)
}

function proxyDecorator<T extends ActionTarget>(proxyHandler: ProxyHandler<T>) {
  return function (_, __, getter: () => T): () => T {
    return function (this: HTMLElement): T {
      const target = <T>getter.call(this)

      if (!OwnerManager.hasOwner(target)) {
        OwnerManager.setOwner(target, this)
      }
      return target[SymbolProxy] || (target[SymbolProxy] = new Proxy<T>(target, proxyHandler))
    }
  }
}

function getAttachableAttr(attr: Attr): Attr {
  if (OwnerManager.hasShadowOwner(attr)) {
    // @TODO: use name or localname in createAttributeNS ?
    const attrClone = attr.namespaceURI
      ? document.createAttributeNS(attr.namespaceURI, attr.name)
      : document.createAttribute(attr.name);

    setAttrValue(attrClone, attr.value)

    return attrClone
  }
  return attr
}