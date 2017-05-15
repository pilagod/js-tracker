/// <reference path='./injectscript.d.ts' />

import ActionTagMap from './tracker/ActionTagMap'
import ActionTypeMap from './tracker/ActionTypeMap'
import TrackidManager from './tracker/TrackidManager'
import utils from './tracker/utils'

const trackidManager = new TrackidManager();

(<any>window)._trackidManager = trackidManager

for (let ctr in ActionTypeMap) {
  const proto = window[ctr].prototype

  Object.getOwnPropertyNames(proto).forEach((prop) => {
    const descriptor =
      Object.getOwnPropertyDescriptor(proto, prop)

    Object.defineProperty(
      proto,
      prop,
      decorate(ctr, prop, descriptor)
    )
  })
}

function decorate(
  target: string,
  action: PropertyKey,
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
  action: PropertyKey,
  actionFunc: (...args: any[]) => any
): (this: TrackTarget, ...args: any[]) => any {
  return function (...args) {
    window.postMessage(
      TrackData(this, target, action), '*'
    )
    return actionFunc.call(this, ...args)
  }
}

function TrackData(
  caller: TrackTarget,
  target: string,
  action: PropertyKey
): ITrackData {
  return {
    trackid: getTrackid(caller),
    target,
    action
  }
}

function getTrackid(caller: TrackTarget): string {
  // @NOTE: Attr create by document.createAttribute will have null owner
  let owner: HTMLElement | null =
    caller instanceof HTMLElement ? caller : caller._owner

  // @NOTE: only <Attr>caller._owner will be null
  // if (owner === null) {
  //   owner = document.createElement('div');
  //   owner.attributes.setNamedItem(<Attr>caller)
  // }
  if (!owner.dataset.trackid) {
    owner.dataset.trackid = trackidManager.generateID()
  }
  return owner.dataset.trackid
}

setupAttr()
setupElementAttributes()
setupElementClassList()
proxyHTMLElementDataset()
proxyHTMLElementStyle()

function setupAttr(): void {
  Object.defineProperty(Attr.prototype, '_owner', {
    get: function (this: Attr): Element {
      // @TODO: create shadow element, while it is been set, merge the result
      return this.ownerElement
    }
  })
}

function setupElementAttributes(): void {
  const attributesDescriptor =
    Object.getOwnPropertyDescriptor(Element.prototype, 'attributes')

  attributesDescriptor.get = (function (
    getter: PropertyDescriptor['get']
  ): PropertyDescriptor['get'] {
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

function setupElementClassList(): void {
  const classListDescriptor =
    Object.getOwnPropertyDescriptor(Element.prototype, 'classList')

  classListDescriptor.get = (function (
    getter: PropertyDescriptor['get']
  ): PropertyDescriptor['get'] {
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

function proxyHTMLElementDataset(): void {
  const datasetDescriptor =
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'dataset')

  datasetDescriptor.get = (function (
    getter: PropertyDescriptor['get']
  ): PropertyDescriptor['get'] {
    let datasetProxy: DOMStringMap

    return function (this: HTMLElement): DOMStringMap {
      if (!datasetProxy) {
        const dataset = getter.call(this)
        const owner = this

        datasetProxy = new Proxy<DOMStringMap>(dataset, {
          set: function (target, action, value) {
            if (action !== 'trackid') {
              window.postMessage(
                TrackData(owner, 'DOMStringMap', action), '*'
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

function proxyHTMLElementStyle(): void {
  const styleDescriptor =
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style')

  styleDescriptor.get = (function (
    getter: PropertyDescriptor['get']
  ): PropertyDescriptor['get'] {
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
              // return function (...args) {
              //   return target[action].call(target, ...args)
              // }
            }
            return target[action]
          },
          set: function (target, action, value) {
            window.postMessage(
              TrackData(
                target,
                'CSSStyleDeclaration',
                <string>action
              ), '*'
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
