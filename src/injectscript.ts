/// <reference path='./injectscript.d.ts' />

import ActionTypeMap from './tracker/ActionTypeMap'
import TrackStore from './tracker/TrackStore'
import utils from './tracker/utils'

trackGeneralCases()

trackHTMLElementAnomalies()
trackElementAnomalies()
trackAttrAnomalies()
trackNamedNodeMapAnomalies()

function trackGeneralCases() {
  for (let ctr in ActionTypeMap) {
    const proto = window[ctr].prototype

    Object.getOwnPropertyNames(proto).forEach((prop) => {
      if (!utils.isAnomaly(ctr, prop)) {
        const descriptor =
          Object.getOwnPropertyDescriptor(proto, prop)

        Object.defineProperty(
          proto,
          prop,
          decorate(ctr, prop, descriptor)
        )
      }
    })
  }

  function decorate(
    target: string,
    action: Action,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    if (utils.isMethodDescriptor(descriptor)) {
      descriptor.value =
        trackDecorator(target, action, descriptor.value)
    } else if (utils.isSettableDescriptor(descriptor)) {
      descriptor.set =
        trackDecorator(target, action, descriptor.set)
    }
    return descriptor
  }

  function trackDecorator(
    target: string,
    action: Action,
    actionFunc: (...args: any[]) => any
  ): (...args: any[]) => any {
    return function (...args) {
      window.postMessage(
        TrackStore.createTrackData({
          caller: this,
          target,
          action
        }),
        '*'
      )
      return actionFunc.call(this, ...args)
    }
  }
}

function trackHTMLElementAnomalies() {
  proxyDataset()
  proxyStyle()

  function proxyDataset() {
    const datasetDescriptor =
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'dataset')

    datasetDescriptor.get = (function (getter) {
      let datasetProxy: DOMStringMap

      return function (this: HTMLElement): DOMStringMap {
        if (!datasetProxy) {
          const dataset = getter.call(this)
          const owner = this

          datasetProxy = new Proxy<DOMStringMap>(dataset, {
            set: function (target, action, value) {
              if (action !== 'trackid') {
                window.postMessage(
                  TrackStore.createTrackData({
                    caller: owner,
                    target: 'DOMStringMap',
                    action
                  }),
                  '*'
                )
              }
              target[action] = value
              return true
            }
          })
        }
        return datasetProxy
      }
    })(datasetDescriptor.get)

    Object.defineProperty(
      HTMLElement.prototype,
      'dataset',
      datasetDescriptor
    )
  }

  function proxyStyle() {
    const styleDescriptor =
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style')

    styleDescriptor.get = (function (getter) {
      let styleProxy: CSSStyleDeclaration

      return function (this: HTMLElement): CSSStyleDeclaration {
        if (!styleProxy) {
          const style = getter.call(this)

          style._owner = this

          styleProxy = new Proxy<CSSStyleDeclaration>(style, {
            get: function (target, action) {
              // @NOTE: 
              //    function should redirect caller to target, or caller will be Proxy,
              //    and if methods need to be called by the right caller, it will raise
              //    Illegal Invocation Error.
              if (typeof target[action] === 'function') {
                return target[action].bind(target)
              }
              return target[action]
            },
            set: function (target, action, value) {
              window.postMessage(
                TrackStore.createTrackData({
                  caller: target,
                  target: 'CSSStyleDeclaration',
                  action: action
                }),
                '*'
              )
              target[action] = value
              return true
            }
          })
        }
        return styleProxy
      }
    })(styleDescriptor.get)

    Object.defineProperty(
      HTMLElement.prototype,
      'style',
      styleDescriptor
    )
  }
}

function trackElementAnomalies() {
  setupAttributes()
  setupClassList()
  trackSetAttributeNode()
  trackSetAttributeNodeNS()

  function setupAttributes() {
    const attributesDescriptor =
      Object.getOwnPropertyDescriptor(Element.prototype, 'attributes')

    attributesDescriptor.get = (function (getter) {
      return function (this: Element): NamedNodeMap {
        const attributes = getter.call(this)

        if (!attributes._owner) {
          attributes._owner = this
        }
        return attributes
      }
    })(attributesDescriptor.get)

    Object.defineProperty(
      Element.prototype,
      'attributes',
      attributesDescriptor
    )
  }

  function setupClassList() {
    const classListDescriptor =
      Object.getOwnPropertyDescriptor(Element.prototype, 'classList')

    classListDescriptor.get = (function (getter) {
      return function (this: Element): DOMTokenList {
        const classList = getter.call(this)

        if (!classList._owner) {
          classList._owner = this
        }
        return classList
      }
    })(classListDescriptor.get)

    Object.defineProperty(
      Element.prototype,
      'classList',
      classListDescriptor
    )
  }

  function trackSetAttributeNode() {
    const setAttributeNodeDescriptor =
      Object.getOwnPropertyDescriptor(Element.prototype, 'setAttributeNode')

    setAttributeNodeDescriptor.value =
      setAttrNodeDecorator(setAttributeNodeDescriptor.value)

    Object.defineProperty(
      Element.prototype,
      'setAttributeNode',
      setAttributeNodeDescriptor
    )
  }

  function trackSetAttributeNodeNS() {
    const setAttributeNodeNSDescriptor =
      Object.getOwnPropertyDescriptor(Element.prototype, 'setAttributeNodeNS')

    setAttributeNodeNSDescriptor.value =
      setAttrNodeDecorator(setAttributeNodeNSDescriptor.value)

    Object.defineProperty(
      Element.prototype,
      'setAttributeNodeNS',
      setAttributeNodeNSDescriptor
    )
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
    const valueDescriptor =
      Object.getOwnPropertyDescriptor(Attr.prototype, 'value')

    valueDescriptor.set = (function (setter) {
      return function (
        this: Attr,
        tsvString: TrackSwitchValue<string>
      ): void {
        if (typeof tsvString === 'string') {
          if (this._owner === null) {
            // @TODO: check namespaceURI
            document.createElement('div').setAttributeNode(<any>{
              off: true,
              value: this
            })
          }
          window.postMessage(
            TrackStore.createTrackData({
              caller: this,
              target: 'Attr',
              action: 'value'
            }),
            '*'
          )
          return setter.call(this, tsvString)
        }
        return setter.call(this, tsvString.value)
      }
    })(valueDescriptor.set)

    Object.defineProperty(
      Attr.prototype,
      'value',
      valueDescriptor
    )
  }
}

function trackNamedNodeMapAnomalies(): void {
  trackSetNamedItem()
  trackSetNamedItemNS()

  function trackSetNamedItem(): void {
    const setNamedItemDescriptor =
      Object.getOwnPropertyDescriptor(NamedNodeMap.prototype, 'setNamedItem')

    setNamedItemDescriptor.value =
      setAttrNodeDecorator(setNamedItemDescriptor.value)

    Object.defineProperty(
      NamedNodeMap.prototype,
      'setNamedItem',
      setNamedItemDescriptor
    )
  }

  function trackSetNamedItemNS(): void {
    const setNamedItemNSDescriptor =
      Object.getOwnPropertyDescriptor(NamedNodeMap.prototype, 'setNamedItemNS')

    setNamedItemNSDescriptor.value =
      setAttrNodeDecorator(setNamedItemNSDescriptor.value)

    Object.defineProperty(
      NamedNodeMap.prototype,
      'setNamedItemNS',
      setNamedItemNSDescriptor
    )
  }
}
// @TODO: post track data
function setAttrNodeDecorator(
  setAttrNode: (attr: Attr) => void
): (
    this: Element | NamedNodeMap,
    tsvAttr: TrackSwitchValue<Attr>
  ) => void {
  return function (tsvAttr) {
    if (tsvAttr instanceof Attr) {
      return setAttrNode.call(this, parseTrackAttr(tsvAttr))
    }
    return setAttrNode.call(this, tsvAttr.value)
  }
}

function parseTrackAttr(attr: Attr): Attr {
  if (attr._owner) {
    let clone

    if (attr.namespaceURI) {
      clone = document.createAttributeNS(
        attr.namespaceURI,
        attr.name // @NOTE not sure to use name or localname ? 
      )
    } else {
      clone = document.createAttribute(attr.name)
    }
    clone.value = <any>{
      off: true,
      value: attr.value
    }
    return clone
  }
  return attr
}