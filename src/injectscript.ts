/// <reference path='./tracker/tracker.d.ts'/>

import * as StackTrace from 'stacktrace-js'
import ActionMap from './tracker/ActionMap'
import ActionTag from './tracker/ActionTag'
import Anomalies from './tracker/Anomalies'
import TrackIDManager from './tracker/TrackIDManager'

main()

function main(): void {
  trackGeneralCases()
  trackHTMLElementAnomalies()
  trackElementAnomalies()
  trackAttrAnomalies()
  trackNamedNodeMapAnomalies()
}

function trackTemplate(
  template: {
    target: Target,
    action: Action,
    decorator: (
      target: Target,
      action: Action,
      actionFunc: (...args: any[]) => any
    ) => (...args: any[]) => any,
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
        caller: this, target, action,
        actionTag: ActionTag.parse(this, target, action, args)
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
  const actionInfo: ActionInfo = {
    trackid: getTrackID(data.caller),
    target: data.target,
    action: data.action,
    stacktrace: StackTrace.getSync()
  }
  if (data.merge) {
    actionInfo.merge = data.merge
  }
  if (data.actionTag) {
    actionInfo.actionTag = data.actionTag
  }
  window.postMessage(actionInfo, '*')
}

function getTrackID(caller: ActionTarget): string {
  const owner: Owner = caller._owner

  if (!owner._trackid) {
    owner._trackid = TrackIDManager.generateID()
  }
  return owner._trackid
}

function trackHTMLElementAnomalies(): void {
  proxyDataset()
  proxyStyle()

  function proxyDataset(): void {
    trackTemplate({
      target: 'HTMLElement',
      action: 'dataset',
      decorator: datasetProxyDecorator,
      getter: true
    })
    function datasetProxyDecorator(_, __: any,
      getter: () => DOMStringMap
    ): () => DOMStringMap {
      let datasetProxy: DOMStringMap

      return function (this: HTMLElement): DOMStringMap {
        if (!datasetProxy) {
          const dataset = getter.call(this);
          (function (owner) {
            Object.defineProperty(dataset, '_owner', {
              get: function () {
                return owner
              }
            })
          })(this)
          datasetProxy = new Proxy<DOMStringMap>(dataset, {
            set: function (target, action, value) {
              record({
                caller: target,
                target: 'DOMStringMap',
                action
              })
              target[action] = value
              return true
            }
          })
        }
        return datasetProxy
      }
    }
  }

  function proxyStyle(): void {
    trackTemplate({
      target: 'HTMLElement',
      action: 'style',
      decorator: styleProxyDecorator,
      getter: true
    })
    function styleProxyDecorator(_, __: any,
      getter: () => CSSStyleDeclaration
    ): () => CSSStyleDeclaration {
      let styleProxy: CSSStyleDeclaration

      return function (this: HTMLElement): CSSStyleDeclaration {
        if (!styleProxy) {
          const style = getter.call(this)

          style._owner = this

          styleProxy = new Proxy<CSSStyleDeclaration>(style, {
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
        return styleProxy
      }
    }
  }
}

function trackElementAnomalies() {
  setupOwner()
  trackAttributes()
  trackClassList()
  trackSetAttributeNode()

  function setupOwner() {
    Object.defineProperty(Element.prototype, '_owner', {
      get: function () {
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
    function NamedNodeMapDecorator(
      _, __: any,
      getter: () => NamedNodeMap
    ): () => NamedNodeMap {
      return function (this: Element): NamedNodeMap {
        const target = <NamedNodeMap>getter.call(this)

        if (!target._owner) {
          target._owner = this
        }
        return target
      }
    }
  }

  function trackClassList() {
    trackTemplate({
      target: 'Element',
      action: 'classList',
      decorator: DOMTokenListDecorator,
      getter: true
    })
    function DOMTokenListDecorator(
      _: any,
      which: string,
      getter: () => DOMTokenList
    ): () => DOMTokenList {
      return function (this: Element): DOMTokenList {
        const target = <DOMTokenList>getter.call(this)

        if (!target._owner) {
          target._owner = this
        }
        if (!target._which) {
          target._which = which
        }
        return target
      }
    }
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

function setAttrNodeDecorator(
  target: Target,
  action: Action,
  actionFunc: (attr: Attr) => void
): (tsvAttr: TrackSwitchValue<Attr>) => void {
  return function (tsvAttr) {
    if (tsvAttr instanceof Attr) {
      const result = actionFunc.call(this, extractAttr(tsvAttr))

      record({
        caller: this, target, action,
        actionTag: tsvAttr.name,
        merge: tsvAttr._owner && tsvAttr._owner._trackid
      })
      return result
    }
    // @NOTE: bypass record process
    return actionFunc.call(this, tsvAttr.value)
  }
}

function extractAttr(attr: Attr): Attr {
  if (attr._owner && attr._owner._isShadow) {
    // @NOTE: use name or localname in createAttributeNS ?
    const clone = attr.namespaceURI ?
      document.createAttributeNS(attr.namespaceURI, attr.name) :
      document.createAttribute(attr.name);

    clone.value = <any>{
      off: true,
      value: attr.value
    }
    return clone
  }
  return attr
}

type TrackSwitchValue<T> = T | {
  off?: boolean;
  value: T;
}

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
    function valueDecorator(
      target: Target,
      action: Action,
      setter: (value: string) => void
    ): (tsvString: TrackSwitchValue<string>) => void {
      return function (tsvString) {
        if (typeof tsvString === 'string') {
          if (this._owner === null) {
            // @TODO: check namespaceURI
            const shadowOwner = document.createElement('div')

            shadowOwner._isShadow = true
            shadowOwner.setAttributeNode(<any>{
              off: true,
              value: this
            })
          }
          record({
            caller: this, target, action,
            actionTag: this.name
          })
          return setter.call(this, tsvString)
        }
        // @NOTE: bypass record process
        return setter.call(this, tsvString.value)
      }
    }
  }
}

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