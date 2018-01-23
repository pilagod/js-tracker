/// <reference path='./index.d.ts'/>

import ActionMap from './private/ActionMap'
import ActionTagMap from './private/ActionTagMap'
import Anomalies from './private/Anomalies'
import OwnerManager from './private/OwnerManager'
import ShadowElement from './private/ShadowElement'
import StackTracer from './private/StackTracer'
import { SymbolProxy, SymbolWhich } from './private/Symbols'
import {
  attachAttr,
  sendActionInfoToContentscript,
  setAttrValue
} from './private/NativeUtils'

setupShadowElement()
setupWindow()
setupDocument()
trackGeneralCases()
trackHTMLElementAnomalies()
trackElementAnomalies()
trackAttrAnomalies()
trackNamedNodeMapAnomalies()

/**
 * register custom elements
 */

function setupShadowElement(): void {
  customElements.define(ShadowElement.TagName, ShadowElement)
}

function setupWindow(): void {
  setupNonElementTarget(window, 'window')
}

function setupDocument(): void {
  setupNonElementTarget(document, 'document')
}

function setupNonElementTarget(target: ActionTarget, name: string): void {
  const infoElementName = `${name}-info`

  customElements.define(
    infoElementName,
    class extends HTMLElement { }
  )
  const infoElement =
    document.createElement(infoElementName)

  OwnerManager.setOwner(target, infoElement)
  document.documentElement.appendChild(infoElement)
}

/**
 * tracker utils
 */

function trackTemplate(
  template: {
    target: Target,
    action: Action,
    decorator: (
      target: Target,
      action: Action,
      actionFunc: (this: ActionTarget, ...args: any[]) => any
    ) => (this: ActionTarget, ...args: any[]) => any,
    getter?: boolean
  }
): void {
  const { target, action, decorator } = template
  const shouldTrackGetter = template.getter
  const descriptor =
    Reflect.getOwnPropertyDescriptor(window[target].prototype, action)
  // @NOTE: getter, setter, method are mutual exclusive
  if (shouldTrackGetter && hasGetter(descriptor)) {
    descriptor.get =
      decorator(target, action, descriptor.get)
  } else if (hasSetter(descriptor)) {
    descriptor.set =
      decorator(target, action, descriptor.set)
  } else if (hasMethod(descriptor)) {
    descriptor.value =
      decorator(target, action, descriptor.value)
  }
  Reflect.defineProperty(window[target].prototype, action, descriptor)
}

function hasGetter(descriptor: PropertyDescriptor): boolean {
  return !!descriptor.get
}

function hasSetter(descriptor: PropertyDescriptor): boolean {
  return !!descriptor.set
}

function hasMethod(descriptor: PropertyDescriptor): boolean {
  return !!descriptor.value && (typeof descriptor.value === 'function')
}

function record(
  data: {
    caller: ActionTarget,
    target: Target,
    action: Action,
    args?: any[],
    merge?: string
  }
): void {
  // @NOTE: target should not be derived from the type of caller
  // e.g., {
  //  caller: HTMLDivElement, 
  //  target: Element, 
  //  action: id
  // }
  if (!OwnerManager.hasOwner(data.caller)) {
    // @NOTE: although typescript predefine that caller should be ActionTarget,
    // caller is actually determined in runtime, and it's possible to get invalid 
    // callers, e.g., DocumentFragment, XHRHttpRequst
    return
  }
  const owner = OwnerManager.getOwner(data.caller)

  sendActionInfoToContentscript(
    <ActionInfo>{
      trackid: (!owner.hasTrackID() && owner.setTrackID()) || owner.getTrackID(),
      type: ActionMap.getActionType(data),
      loc: StackTracer.getSourceLocation(),
      merge: data.merge
    }
  )
}

/**
 * trackGeneralCases
 */

function trackGeneralCases(): void {
  ActionMap.visit(function (target) {
    const proto = window[target].prototype

    Object.getOwnPropertyNames(proto).forEach((action) => {
      if (ActionMap.has(target, action) && !Anomalies.has(target, action)) {
        trackTemplate({ target, action, decorator })
      }
    })
  })

  function decorator(
    target: Target,
    action: Action,
    actionFunc: (...args: any[]) => any
  ): (...args: any[]) => any {
    return function (...args) {
      const result = actionFunc.call(this, ...args)

      record({ caller: this, target, action, args })

      return result
    }
  }
}

/**
 * trackHTMLElementAnomalies
 */

function trackHTMLElementAnomalies(): void {
  trackDataset()
  trackStyle()

  function trackDataset(): void {
    trackTemplate({
      target: 'HTMLElement',
      action: 'dataset',
      decorator: createDatasetDecorator(),
      getter: true
    })
  }

  function createDatasetDecorator() {
    return proxyDecoratorTemplate(<ProxyHandler<DOMStringMap>>{
      set: (target, action, value: string) => {
        target[action] = value
        record({ caller: target, target: 'DOMStringMap', action })
        return true
      }
    })
  }

  function trackStyle(): void {
    trackTemplate({
      target: 'HTMLElement',
      action: 'style',
      decorator: createStyleDecorator(),
      getter: true
    })
  }

  function createStyleDecorator() {
    return proxyDecoratorTemplate(<ProxyHandler<CSSStyleDeclaration>>{
      get: function (target, action) {
        // @NOTE: function should bind to target, otherwise its context 
        // will be the Proxy, and throwing Illegal Invocation Error.
        return typeof target[action] === 'function'
          ? target[action].bind(target)
          : target[action]
      },
      set: function (target, action, value) {
        target[action] = value
        record({ caller: target, target: 'CSSStyleDeclaration', action })
        return true
      }
    })
  }
}

function proxyDecoratorTemplate<T extends ActionTarget>(proxyHandler: ProxyHandler<T>) {
  return function (_: any, __: any, getter: () => T): () => T {
    return function (this: HTMLElement): T {
      const target = <T>getter.call(this)

      if (!OwnerManager.hasOwner(target)) {
        OwnerManager.setOwner(target, this)
      }
      return target[SymbolProxy] || (target[SymbolProxy] = new Proxy<T>(target, proxyHandler))
    }
  }
}

/**
 * trackElementAnomalies
 */

function trackElementAnomalies(): void {
  setupOwner()
  trackAttributes()
  trackClassList()
  trackSetAttributeNode()

  function setupOwner(): void {
    OwnerManager.setOwnerByGetter(
      Element.prototype,
      (context: Element) => context
    )
  }

  function trackAttributes(): void {
    trackTemplate({
      target: 'Element',
      action: 'attributes',
      decorator: NamedNodeMapDecorator,
      getter: true
    })
  }

  function trackClassList(): void {
    trackTemplate({
      target: 'Element',
      action: 'classList',
      decorator: DOMTokenListDecorator,
      getter: true
    })
  }

  function trackSetAttributeNode(): void {
    for (let anomaly of [
      'setAttributeNode',
      'setAttributeNodeNS'
    ]) {
      trackTemplate({
        target: 'Element',
        action: anomaly,
        decorator: setAttrNodeDecorator
      })
    }
  }
}

function NamedNodeMapDecorator(
  _, __: any,
  getter: () => NamedNodeMap
): () => NamedNodeMap {
  return function (this: Element): NamedNodeMap {
    const target = <NamedNodeMap>getter.call(this)

    if (!OwnerManager.hasOwner(target)) {
      OwnerManager.setOwner(target, this)
    }
    return target
  }
}

function DOMTokenListDecorator(
  _: any,
  which: string,
  getter: () => DOMTokenList
): (this: Element) => DOMTokenList {
  return function () {
    const target = <DOMTokenList>getter.call(this)

    if (!OwnerManager.hasOwner(target)) {
      OwnerManager.setOwner(target, this)
    }
    if (!target[SymbolWhich]) {
      target[SymbolWhich] = which /* classList, relList */
    }
    return target
  }
}

function setAttrNodeDecorator(
  target: Target,
  action: Action,
  actionFunc: (attr: Attr) => void
): (attr: Attr) => void {
  return function (attr) {
    // @NOTE: error might raise here, native operation 
    // should call before recording
    const result = actionFunc.call(this, parseAttr(attr))

    record({
      caller: this, target, action, args: [attr],
      merge: OwnerManager.hasShadowOwner(attr)
        ? OwnerManager.getOwner(attr).getTrackID()
        : undefined
    })
    return result
  }
}

function parseAttr(attr: Attr): Attr {
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

/**
 * trackAttrAnomalies
 */

function trackAttrAnomalies(): void {
  setupAttr()
  trackValue()

  function setupAttr(): void {
    OwnerManager.setOwnerByGetter(
      Attr.prototype,
      (context: Attr) => context.ownerElement
    )
  }

  function trackValue(): void {
    trackTemplate({
      target: 'Attr',
      action: 'value',
      decorator: valueDecorator
    })
  }
}

function valueDecorator(
  target: Target,
  action: Action,
  setter: (value: string) => void
): (this: Attr, value: string) => void {
  return function (value) {
    if (!OwnerManager.hasOwner(this)) {
      attachAttrToShadowElement(this)
    }
    const result = setter.call(this, value)

    record({ caller: this, target, action })

    return result
  }
}

function attachAttrToShadowElement(attr: Attr) {
  // @TODO: check namespaceURI
  attachAttr(document.createElement(ShadowElement.TagName), attr)
}

/**
 * trackNamedNodeMapAnomalies
 */

function trackNamedNodeMapAnomalies(): void {
  for (let anomaly of [
    'setNamedItem',
    'setNamedItemNS'
  ]) {
    trackTemplate({
      target: 'NamedNodeMap',
      action: anomaly,
      decorator: setAttrNodeDecorator
    })
  }
}