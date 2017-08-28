/// <reference path='../public/ActionStore.d.ts'/>

import TrackIDFactory from '../public/TrackIDFactory'

/**
 * A series of actions bypass tracker's record process
 */

export const attachAttr = (function (setAttributeNode) {
  return function (container: Element, attr: Attr) {
    setAttributeNode.call(container, attr)
  }
})(Element.prototype.setAttributeNode)

export const attachListenerTo = (function (addEventListener) {
  return function (target: EventTarget, event: string, listener: (e: Event) => void) {
    addEventListener.call(target, event, listener)
  }
})(EventTarget.prototype.addEventListener)

export const detachListenerFrom = (function (removeEventListener) {
  return function (target: EventTarget, event: string, listener: (e: Event) => void) {
    removeEventListener.call(target, event, listener)
  }
})(EventTarget.prototype.removeEventListener)

export const sendActionInfoToContentscript = (function (context, dispatchEvent) {
  return function (info: ActionInfo) {
    dispatchEvent.call(context, new CustomEvent('js-tracker', {
      detail: { info }
    }))
  }
})(window, EventTarget.prototype.dispatchEvent)

export const setAttrValue = (function (setValue) {
  return function (attr: Attr, value: string) {
    return setValue.call(attr, value)
  }
})(Reflect.getOwnPropertyDescriptor(Attr.prototype, 'value').set)

export const setTrackID = (function (setAttribute) {
  return function (target: Element) {
    return setAttribute.call(target, 'trackid', TrackIDFactory.generateID())
  }
})(Element.prototype.setAttribute)