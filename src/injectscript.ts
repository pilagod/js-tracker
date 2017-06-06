///<reference path='./tracker/ActionStore.d.ts'/>

import * as StackTrace from 'stacktrace-js'
import utils from './tracker/utils'

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
    target: string,
    action: Action,
    decorator: (...args: any[]) => any,
    getter?: boolean
  }
) {
  const { target, action, decorator } = template
  const descriptor =
    Object.getOwnPropertyDescriptor(window[target].prototype, action)
  // @NOTE: getter & setter are mutual exclusive with value
  if (template.getter && utils.hasGetter(descriptor)) {
    descriptor.get =
      decorator(target, action, descriptor.get)
  } else if (utils.hasSetter(descriptor)) {
    descriptor.set =
      decorator(target, action, descriptor.set)
  } else if (utils.hasMethod(descriptor)) {
    descriptor.value =
      decorator(target, action, descriptor.value)
  }
  Object.defineProperty(window[target].prototype, action, descriptor)
}

function trackGeneralCases(): void {
  for (let target in utils.getActionTypeMap()) {
    const proto = window[target].prototype

    Object.getOwnPropertyNames(proto).forEach((action) => {
      if (!utils.isAnomaly(target, action)) {
        trackTemplate({ target, action, decorator })
      }
    })
  }
  function decorator(
    target: string,
    action: Action,
    actionFunc: (...args: any[]) => any
  ): (...args: any[]) => any {
    return function (...args) {
      // @NOTE: type of target might be different from type of caller
      // e.g. caller: HTMLDivElement, target: Element, action: id
      storeAction({ caller: this, target, action })
      return actionFunc.call(this, ...args)
    }
  }
}

function storeAction(
  data: {
    caller: ActionTarget,
    target: string,
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
  window.postMessage(actionInfo, '*')
}

function getTrackID(caller: ActionTarget): string {
  const owner = caller._owner

  if (!owner._trackid) {
    owner._trackid = utils.generateTrackID()
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
              storeAction({
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
              storeAction({
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
  // track attributes and classList
  for (let anomaly of ['attributes', 'classList']) {
    trackTemplate({
      target: 'Element',
      action: anomaly,
      decorator: subDecorator,
      getter: true
    })
  }
  // track setAttributeNode{NS}
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
  function setupOwner() {
    Object.defineProperty(Element.prototype, '_owner', {
      get: function () {
        return this
      }
    })
  }
  function subDecorator<T>(_, __: any,
    getter: () => T
  ): () => T {
    return function (this: Element): T {
      const target = getter.call(this)

      if (!target._owner) {
        target._owner = this
      }
      return target
    }
  }
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
      target: string,
      action: Action,
      setter: (value: string) => void
    ): (tsvString: TrackSwitchValue<string>) => void {
      return function (tsvString) {
        if (typeof tsvString === 'string') {
          if (this._owner === null) {
            // @TODO: check namespaceURI
            document.createElement('div').setAttributeNode(<any>{
              off: true,
              value: this
            })
          }
          storeAction({ caller: this, target, action })
          return setter.call(this, tsvString)
        }
        return setter.call(this, tsvString.value)
      }
    }
  }
}

function trackNamedNodeMapAnomalies(): void {
  // track setNamedItem{NS}
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

function setAttrNodeDecorator(
  target: string,
  action: Action,
  actionFunc: (attr: Attr) => void
): (tsvAttr: TrackSwitchValue<Attr>) => void {
  return function (tsvAttr) {
    if (tsvAttr instanceof Attr) {
      // @TODO: setup merge
      storeAction({ caller: this, target, action })
      return actionFunc.call(this, parseActionAttr(tsvAttr))
    }
    return actionFunc.call(this, tsvAttr.value)
  }
}

function parseActionAttr(attr: Attr): Attr {
  if (attr._owner) {
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