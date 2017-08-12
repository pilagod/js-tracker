export default class ShadowElement extends HTMLElement {
  static TagName = 'shadow-element'
  static [Symbol.hasInstance](instance: Element | any) {
    return instance instanceof Element
      && instance.tagName.toLowerCase() === ShadowElement.TagName
  }
  constructor() {
    super()
  }
}