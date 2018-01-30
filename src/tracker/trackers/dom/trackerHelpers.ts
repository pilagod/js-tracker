/// <reference path='../../types/ActionTarget.d.ts'/>

import ActionMap from '../../private/ActionMap'
import OwnerManager from '../../private/OwnerManager'
import ShadowElement from '../../private/ShadowElement'
import {
  attachAttr,
  sendMessageToContentScript,
  setAttrValue
} from '../../private/NativeUtils'
import { SymbolProxy, SymbolWhich } from '../../private/Symbols'
import { recordWrapper } from '../utils'

type RecordInfo = {
  caller: ActionTarget,
  target: Target,
  action: Action,
  args?: any[],
  merge?: string
}

type Decorator = (
  target: Target,
  action: Action,
  actionFunc: (this: ActionTarget, ...args: any[]) => any
) => (this: ActionTarget, ...args: any[]) => any

export const decorators: { [name: string]: Decorator } = {
  general: (target, action, actionFunc) => {
    return function (...args) {
      return recordWrapper(() => {
        const result = actionFunc.call(this, ...args)
        const info: RecordInfo = { caller: this, target, action, args }

        record(info)

        return result
      })
    }
  },

  // element.setAttributeNode(...)
  // element.attributes.setNamedItem(...)
  setAttributeNode: (target, action, actionFunc: (attr: Attr) => void) => {
    return function (attr: Attr): void {
      return recordWrapper(() => {
        const pureAttr = getPureAttr(attr)
        const result = actionFunc.call(this, pureAttr)
        const info: RecordInfo = { caller: this, target, action, args: [pureAttr] }

        if (OwnerManager.hasShadowOwner(attr)) {
          info.merge = OwnerManager.getOwner(attr).getTrackID()
        }
        record(info)

        return result
      })
    }
  },

  // documemt.createAttribute('...').value = '...'
  value: (target, action, setter: (value: string) => void) => {
    return function (this: Attr, value: string): void {
      return recordWrapper(() => {
        if (!OwnerManager.hasOwner(this)) {
          // @TODO: check namespaceURI
          attachAttr(document.createElement(ShadowElement.TagName), this)
        }
        const result = setter.call(this, value)
        const info: RecordInfo = { caller: this, target, action }

        record(info)

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
      return recordWrapper(() => {
        target[action] = value
        record({ caller: target, target: 'CSSStyleDeclaration', action })
        return true
      })
    }
  }),

  // dataset
  DOMStringMap: proxyDecorator(<ProxyHandler<DOMStringMap>>{
    set: (target, action, value: string) => {
      return recordWrapper(() => {
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

function record(info: RecordInfo): void {
  // @NOTE: target should not be derived from the type of caller
  // e.g., { caller: HTMLDivElement, target: Element, action: id }
  if (!OwnerManager.hasOwner(info.caller)) {
    // @NOTE: although typescript predefine that caller should be ActionTarget,
    // caller is actually determined in runtime, and it's possible to get invalid 
    // callers, e.g., DocumentFragment, XHRHttpRequst
    return
  }
  const owner = OwnerManager.getOwner(info.caller)

  if (!owner.hasTrackID()) {
    owner.setTrackID()
  }
  const record: RecordData = {
    trackid: owner.getTrackID(),
    type: ActionMap.getActionType(info),
  }
  if (info.merge) {
    record.merge = info.merge
  }
  sendMessageToContentScript({
    state: 'record',
    data: record
  })
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

function getPureAttr(attr: Attr): Attr {
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
