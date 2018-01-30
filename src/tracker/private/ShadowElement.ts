export default class ShadowElement extends HTMLElement {
  static TagName = 'shadow-element'
  // @NOTE: upgrades only apply to elements in the document tree. 
  // (Formally, elements that are connected.) An element that is
  // not inserted into a document will stay un-upgraded
  // 2.1.4 Upgrading elements after their creation [https://w3c.github.io/webcomponents/spec/custom/]
  // hence, we define [Symbol.hasInstance] on ShadowElement
  static [Symbol.hasInstance](instance: Element | any) {
    return instance instanceof Element
      && instance.tagName.toLowerCase() === ShadowElement.TagName
  }
  constructor() {
    super()
  }
}