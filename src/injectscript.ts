/// <reference path='./tracker/tracker.d.ts'/>

import * as StackTrace from 'stacktrace-js'
import ActionMap from './tracker/ActionMap'
import ActionTagMap from './tracker/ActionTagMap'
import Anomalies from './tracker/Anomalies'
import TrackIDManager from './tracker/TrackIDManager'

trackGeneralCases()
trackHTMLElementAnomalies()
trackElementAnomalies()
trackAttrAnomalies()
trackNamedNodeMapAnomalies()

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
    Object.getOwnPropertyDescriptor(window[target].prototype, action)
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
  Object.defineProperty(window[target].prototype, action, descriptor)
}

function hasGetter(descriptor: PropertyDescriptor): boolean {
  return !!descriptor.get
}

function hasMethod(descriptor: PropertyDescriptor): boolean {
  return !!descriptor.value && (typeof descriptor.value === 'function')
}

function hasSetter(descriptor: PropertyDescriptor): boolean {
  return !!descriptor.set
}

function NonTrackedSetter(
  target: object,
  prop: PropertyKey,
  value: any
): boolean {
  target[prop] = { value }
  return true
}

function NonTrackedCaller<T>(
  caller: (...args: any[]) => T,
  context: any,
  ...args: any[]
): T {
  return caller.apply(context, args.map((arg) => ({ value: arg })))
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
      // @NOTE: type of target might be different from type of caller
      // e.g. caller: HTMLDivElement, target: Element, action: id
      record({
        caller: this,
        target,
        action,
        actionTag: ActionTagMap.fetchActionTag(this, target, action, args)
      })
      return actionFunc.call(this, ...args)
    }
  }
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
  const info: ActionInfo = {
    trackid: getTrackID(data.caller),
    target: data.target,
    action: data.action,
    stacktrace: StackTrace.getSync()
  }
  if (data.merge) {
    info.merge = data.merge
  }
  if (data.actionTag) {
    info.actionTag = data.actionTag
  }
  window.postMessage(info, '*')
}

function getTrackID(caller: ActionTarget): string {
  const owner = caller._owner

  if (!owner.dataset._trackid) {
    const trackid = TrackIDManager.generateID()

    NonTrackedSetter(owner.dataset, '_trackid', trackid)
  }
  return owner.dataset._trackid
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
              record({
                caller: target,
                target: 'DOMStringMap',
                action
              })
              target[action] = tsvString
            } else {
              target[action] = tsvString.value
            }
            return true
          }
        })
        Object.defineProperty(dataset, '_owner', {
          get: () => this
        })
        Object.defineProperty(dataset, '_proxy', {
          get: () => datasetProxy
        })
      }
      return dataset._proxy
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
        style._owner = this
        style._proxy = new Proxy<CSSStyleDeclaration>(style, {
          get: function (target, action) {
            // @NOTE: function should bind to target, otherwise, 
            // its context will be Proxy, and throwing Illegal Invocation Error.
            if (typeof target[action] === 'function') {
              return target[action].bind(target)
            }
            return target[action]
          },
          set: function (target, action, value) {
            record({
              caller: target,
              target: 'CSSStyleDeclaration',
              action
            })
            target[action] = value
            return true
          }
        })
      }
      return style._proxy
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
    Object.defineProperty(Element.prototype, '_owner', {
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
      record({
        caller: this,
        target,
        action,
        actionTag: tsvAttr.name,
        merge: tsvAttr._owner && tsvAttr._owner.dataset._trackid
      })
      return actionFunc.call(this, extractAttr(tsvAttr))
    }
    return actionFunc.call(this, tsvAttr.value)
  }
}

function extractAttr(attr: Attr): Attr {
  if (hasShadowOwner(attr)) {
    // @NOTE: use name or localname in createAttributeNS ?
    const _attr = attr.namespaceURI
      ? document.createAttributeNS(attr.namespaceURI, attr.name)
      : document.createAttribute(attr.name);

    NonTrackedSetter(_attr, 'value', attr.value)
    return _attr
  }
  return attr
}

function hasShadowOwner(target: ActionTarget): boolean {
  return !!(target._owner && target._owner.dataset._isShadow)
}

/**
 * trackAttrAnomalies
 */

function trackAttrAnomalies(): void {
  setupAttr()
  trackValue()

  function setupAttr() {
    Object.defineProperty(Attr.prototype, '_owner', {
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
        if (this._owner === null) {
          attachAttrToShadowOwner(this)
        }
        record({
          caller: this,
          target,
          action,
          actionTag: this.name
        })
        return setter.call(this, tsvString)
      }
      return setter.call(this, tsvString.value)
    }
  }

  function attachAttrToShadowOwner(attr: Attr) {
    // @TODO: check namespaceURI
    const owner = document.createElement('div')

    NonTrackedSetter(owner.dataset, '_isShadow', 'true')
    NonTrackedCaller(owner.setAttributeNode, owner, attr)
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