/// <reference path='../public/types/MessageTypes.d.ts'/>

import TrackIDFactory from './TrackIDFactory'

// A series of actions bypass tracker's record process

export const attachAttr = ((setAttributeNode) => {
  return function (container: Element, attr: Attr) {
    setAttributeNode.call(container, attr)
  }
})(Element.prototype.setAttributeNode)

export const attachListenerTo = ((addEventListener) => {
  return function (target: EventTarget, event: string, listener: (e: Event) => void) {
    addEventListener.call(target, event, listener)
  }
})(EventTarget.prototype.addEventListener)

export const detachListenerFrom = ((removeEventListener) => {
  return function (target: EventTarget, event: string, listener: (e: Event) => void) {
    removeEventListener.call(target, event, listener)
  }
})(EventTarget.prototype.removeEventListener)

export const sendMessagesToContentScript = ((context, dispatch) => {
  return function (messages: RecordMessage[]) {
    dispatch.call(context, new CustomEvent('js-tracker', {
      detail: { messages }
    }))
  }
})(window, EventTarget.prototype.dispatchEvent)

export const setAttrValue = ((setValue) => {
  return function (attr: Attr, value: string) {
    return setValue.call(attr, value)
  }
})(Reflect.getOwnPropertyDescriptor(Attr.prototype, 'value').set)

export const setTrackID = ((setAttribute) => {
  return function (target: Element) {
    return setAttribute.call(target, 'trackid', (<any>TrackIDFactory).generateID())
  }
})(Element.prototype.setAttribute)