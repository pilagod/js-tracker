import TrackIDManager from './TrackIDManager'

/**
 * A series of actions bypass tracker's record process
 */

export const attachAttr = (function (setAttributeNode) {
  return function (container: Element, attr: Attr) {
    setAttributeNode.call(container, attr)
  }
})(Element.prototype.setAttributeNode)

export const setAttrValue = (function (setValue) {
  return function (attr: Attr, value: string) {
    return setValue.call(attr, value)
  }
})(Reflect.getOwnPropertyDescriptor(Attr.prototype, 'value').set)

export const setTrackID = (function (setAttribute) {
  return function (target: Element) {
    return setAttribute.call(target, 'trackid', TrackIDManager.generateID())
  }
})(Element.prototype.setAttribute)