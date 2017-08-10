/// <reference path='./Owner.d.ts'/>

import TrackIDManager, {
  Track_ID_Does_Not_Exist
} from './TrackIDManager'

const setTrackID = (function (setAttribute) {
  return function (target: Element) {
    return setAttribute.call(target, 'trackid', TrackIDManager.generateID())
  }
})(Element.prototype.setAttribute)

class ShadowElement extends HTMLElement {
  static TagName = 'shadow-element'
  static [Symbol.hasInstance](instance: Element | any) {
    return instance instanceof Element
      ? instance.tagName.toLowerCase() === ShadowElement.TagName
      : false
  }
  constructor() {
    super()
  }
}
customElements.define(
  ShadowElement.TagName,
  ShadowElement
)
export default class OwnerInstance implements Owner {
  static NullOwner = new (class extends OwnerInstance {
    constructor() {
      super(null)
    }
    getTrackID() {
      return Track_ID_Does_Not_Exist
    }
    isShadow() {
      return false
    }
  })()
  private element: Element

  constructor(element: Element) {
    this.element = element
  }

  public getTrackID() {
    return this.element.getAttribute('trackid')
  }

  public getOwnerElement() {
    return this.element
  }

  public hasTrackID() {
    return !!(this.element.getAttribute('trackid'))
  }

  public isShadow() {
    // @NOTE: upgrades only apply to elements in the document tree. 
    // (Formally, elements that are connected.) An element that is
    // not inserted into a document will stay un-upgraded
    // 2.1.4 Upgrading elements after their creation [https://w3c.github.io/webcomponents/spec/custom/]

    // hence, defining [Symbol.hasInstance] on ShadowElement
    return this.element instanceof ShadowElement
  }

  public setTrackID() {
    return !this.hasTrackID() && setTrackID(this.element)
  }
}