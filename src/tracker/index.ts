/// <reference path='./index.d.ts'/>

import * as StackTrace from 'stacktrace-js'
import ActionMap from './ActionMap'
import ActionTagMap from './ActionTagMap'
import Anomalies from './Anomalies'
import Symbols from './Symbols'
import TrackIDManager from './TrackIDManager'

setupWindow()
setupDocument()
trackGeneralCases()
trackHTMLElementAnomalies()
trackElementAnomalies()
trackAttrAnomalies()
trackNamedNodeMapAnomalies()

/** 
 * setup window and document
 */

function setupWindow(): void {
  setupNonElementTarget(window, 'window')
}

function setupDocument(): void {
  setupNonElementTarget(document, 'document')
}

function setupNonElementTarget(target: ActionTarget, name: string) {
  const infoElementName = `${name}-info`

  customElements.define(
    infoElementName,
    class extends HTMLElement { }
  )
  const infoElement =
    document.createElement(infoElementName)

  document.documentElement.appendChild(infoElement)

  Reflect.defineProperty(target, '_owner', {
    get: () => infoElement
  })
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
) {
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
    actionTag?: string,
    merge?: string
  }
): void {
  // @NOTE: target might be different from type of caller
  // e.g. caller: HTMLDivElement, target: Element, action: id

  if (isNotValidActionTarget(data.caller)) {
    // @NOTE: although typescript predefine caller should be ActionTarget,
    // caller is determined in runtime, and it's possible to get invalid callers
    return
  }
  window.postMessage(<ActionInfo>{
    trackid: getTrackIDFrom(data.caller),
    target: data.target,
    action: data.action,
    actionTag: data.actionTag,
    merge: data.merge,
    stacktrace: StackTrace.getSync()
  }, '*')
}

function isNotValidActionTarget(caller: ActionTarget) {
  return !caller._owner
}

function getTrackIDFrom(caller: ActionTarget): string {
  const owner: Owner = caller._owner

  if (!owner.dataset._trackid) {
    owner.dataset._trackid = NonTracked(TrackIDManager.generateID())
  }
  return owner.dataset._trackid
}

function NonTracked(value: any): any {
  return { value }
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

      record({
        caller: this,
        target,
        action,
        actionTag: ActionTagMap.fetchActionTag(this, target, action, args)
      })
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
      decorator: datasetDecorator,
      getter: true
    })
  }

  function datasetDecorator(
    _, __: any,
    getter: () => DOMStringMap
  ): () => DOMStringMap {
    return function (this: HTMLElement): DOMStringMap {
      const dataset = <DOMStringMap>getter.call(this)

      if (!dataset._owner) {
        const datasetProxy = new Proxy<DOMStringMap>(dataset, {
          set: (target, action, tsvString: TrackSwitchValue<string>) => {
            if (typeof tsvString === 'string') {
              target[action] = tsvString

              record({
                caller: target,
                target: 'DOMStringMap',
                action
              })
              return true
            }
            target[action] = tsvString.value
            return true
          }
        })
        Reflect.defineProperty(dataset, '_owner', {
          get: () => this
        })
        Reflect.defineProperty(dataset, Symbols.Proxy, {
          get: () => datasetProxy
        })
      }
      return Reflect.get(dataset, Symbols.Proxy)
    }
  }

  function trackStyle(): void {
    trackTemplate({
      target: 'HTMLElement',
      action: 'style',
      decorator: styleDecorator,
      getter: true
    })
  }

  function styleDecorator(
    _, __: any,
    getter: () => CSSStyleDeclaration
  ): () => CSSStyleDeclaration {
    return function (this: HTMLElement): CSSStyleDeclaration {
      const style = <CSSStyleDeclaration>getter.call(this)

      if (!style._owner) {
        const styleProxy = new Proxy<CSSStyleDeclaration>(style, {
          get: function (target, action) {
            // @NOTE: function should bind to target, otherwise, 
            // its context will be Proxy, and throwing Illegal Invocation Error.
            if (typeof target[action] === 'function') {
              return target[action].bind(target)
            }
            return target[action]
          },
          set: function (target, action, value) {
            target[action] = value

            record({
              caller: target,
              target: 'CSSStyleDeclaration',
              action
            })
            return true
          }
        })
        Reflect.defineProperty(style, '_owner', {
          get: () => this
        })
        Reflect.defineProperty(style, Symbols.Proxy, {
          get: () => styleProxy
        })
      }
      return Reflect.get(style, Symbols.Proxy)
    }
  }
}

/**
 * trackElementAnomalies
 */

function trackElementAnomalies() {
  setupOwner()
  trackAttributes()
  trackClassList()
  trackSetAttributeNode()

  function setupOwner() {
    Reflect.defineProperty(Element.prototype, '_owner', {
      get: function () {
        // @NOTE: this here refers to all possible
        // HTML elements inheriting Element
        return this
      }
    })
  }

  function trackAttributes() {
    trackTemplate({
      target: 'Element',
      action: 'attributes',
      decorator: NamedNodeMapDecorator,
      getter: true
    })
  }

  function NamedNodeMapDecorator(
    _, __: any,
    getter: () => NamedNodeMap
  ): () => NamedNodeMap {
    return function (this: Element): NamedNodeMap {
      const target = <NamedNodeMap>getter.call(this)

      if (!target._owner) {
        target._owner = this._owner
      }
      return target
    }
  }

  function trackClassList() {
    trackTemplate({
      target: 'Element',
      action: 'classList',
      decorator: DOMTokenListDecorator,
      getter: true
    })
  }

  function trackSetAttributeNode() {
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

function DOMTokenListDecorator(
  _: any,
  which: string,
  getter: () => DOMTokenList
): () => DOMTokenList {
  return function (this: Element): DOMTokenList {
    const target = <DOMTokenList>getter.call(this)

    if (!target._owner) {
      target._owner = this._owner
    }
    if (!target._which) {
      target._which = which /* classList, relList */
    }
    return target
  }
}

function setAttrNodeDecorator(
  target: Target,
  action: Action,
  actionFunc: (attr: Attr) => void
): (tsvAttr: TrackSwitchValue<Attr>) => void {
  return function (tsvAttr) {
    if (tsvAttr instanceof Attr) {
      // @NOTE: error might raise here, it should call
      // action before record
      const owner = tsvAttr._owner
      const result =
        actionFunc.call(this, parseAttr(tsvAttr))

      record({
        caller: this,
        target,
        action,
        actionTag: tsvAttr.name,
        merge: owner && owner.dataset._trackid
      })
      return result
    }
    return actionFunc.call(this, tsvAttr.value)
  }
}

function parseAttr(attr: Attr): Attr {
  if (hasShadowOwner(attr)) {
    // @TODO: use name or localname in createAttributeNS ?
    const _attr = attr.namespaceURI
      ? document.createAttributeNS(attr.namespaceURI, attr.name)
      : document.createAttribute(attr.name);

    _attr.value = NonTracked(attr.value)

    return _attr
  }
  return attr
}

function hasShadowOwner(target: ActionTarget): boolean {
  const owner: Owner = target._owner

  return !!(owner && owner._isShadow)
}

/**
 * trackAttrAnomalies
 */

function trackAttrAnomalies(): void {
  setupAttr()
  trackValue()

  function setupAttr() {
    Reflect.defineProperty(Attr.prototype, '_owner', {
      get: function (this: Attr): Element {
        return this.ownerElement
      }
    })
  }

  function trackValue(): void {
    trackTemplate({
      target: 'Attr',
      action: 'value',
      decorator: valueDecorator
    })
  }

  function valueDecorator(
    target: Target,
    action: Action,
    setter: (value: string) => void
  ): (tsvString: TrackSwitchValue<string>) => void {
    return function (tsvString) {
      if (typeof tsvString === 'string') {
        if (!this._owner) {
          attachAttrToShadowOwner(this)
        }
        const result = setter.call(this, tsvString)

        record({
          caller: this,
          target,
          action,
          actionTag: this.name
        })
        return result
      }
      return setter.call(this, tsvString.value)
    }
  }

  function attachAttrToShadowOwner(attr: Attr) {
    // @TODO: check namespaceURI
    const owner = document.createElement('div')

    owner._isShadow = true
    owner.setAttributeNode(NonTracked(attr))
  }
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