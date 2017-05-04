// HTMLElement -> Element (ChildNode) -> Node -> EventTarget
// categories: attribute, behavior, event, node, style
// attributes, classList, (dataset, style) proxy only
enum Types {
  Attribute = 1 << 0,
  Behavior = 1 << 1,
  Event = 1 << 2,
  Node = 1 << 3,
  Style = 1 << 4
}
export default Types
export const propCls: object = {
  /* Attribute */

  // HTMLElement
  'accessKey': Types.Attribute,
  'contentEditable': Types.Attribute,
  'dir': Types.Attribute,
  'draggable': Types.Attribute,
  'hidden': Types.Attribute,
  'lang': Types.Attribute,
  'spellcheck': Types.Attribute,
  'tabIndex': Types.Attribute,
  'title': Types.Attribute,
  'translate': Types.Attribute,

  // Element
  'id': Types.Attribute,
  'name': Types.Attribute,
  'slot': Types.Attribute,

  // Node
  'nodeValue': Types.Attribute,

  /* Behavior */

  // Element
  'scrollTop': Types.Behavior,
  'scrollLeft': Types.Behavior,

  /* Event */

  // HTMLElement
  'onabort': Types.Event,
  'onanimationcancel': Types.Event,
  'onanimationend': Types.Event,
  'onanimationiteration': Types.Event,
  'onauxclick': Types.Event,
  'onblur': Types.Event,
  'onchange': Types.Event,
  'onclick': Types.Event,
  'onclose': Types.Event,
  'oncontextmenu': Types.Event,
  'oncopy': Types.Event,
  'oncut': Types.Event,
  'ondblclick': Types.Event,
  'onerror': Types.Event,
  'onfocus': Types.Event,
  'ongotpointercapture': Types.Event,
  'oninput': Types.Event,
  'onkeydown': Types.Event,
  'onkeypress': Types.Event,
  'onkeyup': Types.Event,
  'onload': Types.Event,
  'onloadend': Types.Event,
  'onloadstart': Types.Event,
  'onlostpointercapture': Types.Event,
  'onmousedown': Types.Event,
  'onmousemove': Types.Event,
  'onmouseout': Types.Event,
  'onmouseover': Types.Event,
  'onmouseup': Types.Event,
  'onpaste': Types.Event,
  'onpointercancel': Types.Event,
  'onpointerdown': Types.Event,
  'onpointerenter': Types.Event,
  'onpointerleave': Types.Event,
  'onpointermove': Types.Event,
  'onpointerout': Types.Event,
  'onpointerover': Types.Event,
  'onpointerup': Types.Event,
  'onreset': Types.Event,
  'onresize': Types.Event,
  'onscroll': Types.Event,
  'onselect': Types.Event,
  'onselectionchange': Types.Event,
  'onselectstart': Types.Event,
  'onsubmit': Types.Event,
  'ontouchcancel': Types.Event,
  'ontouchmove': Types.Event,
  'ontouchstart': Types.Event,
  'ontransitioncancel': Types.Event,
  'ontransitionend': Types.Event,

  // Element
  'onwheel': Types.Event,

  /* Node */

  // Element
  'innerHTML': Types.Node,
  'outerHTML': Types.Node,

  // Node
  'textContent': Types.Node,
  'innerText': Types.Node,

  /* Style */

  // Element
  'className': Types.Style
}
export const methodCls: object = {
  /* Attribute */

  // Element
  'removeAttribute': Types.Attribute,
  'removeAttributeNode': Types.Attribute,
  'removeAttributeNS': Types.Attribute,
  'setAttribute': Types.Attribute,
  'setAttributeNode': Types.Attribute,
  'setAttributeNodeNS': Types.Attribute,
  'setAttributeNS': Types.Attribute,

  /* Behavior */

  // HTMLElement
  'blur': Types.Behavior,
  'click': Types.Behavior,
  'focus': Types.Behavior,
  'forceSpellCheck': Types.Behavior,

  // Element
  'scrollIntoView': Types.Behavior,

  /* Event */

  // EventTarget
  'addEventListener': Types.Event,
  'dispatchEvent': Types.Event,
  'removeEventListener': Types.Event,

  /* Node */

  // Element
  'append': Types.Node, // @TODO: DOMString
  'attachShadow': Types.Node,
  'insertAdjacentElement': Types.Node,
  'insertAdjacentHTML': Types.Node, // @TODO: DOMString
  'insertAdjacentText': Types.Node,
  'prepend': Types.Node, // @TODO: DOMString

  // ChildNode
  'remove': Types.Node,
  'before': Types.Node, // @TODO: DOMString
  'after': Types.Node, // @TODO: DOMString
  'replaceWith': Types.Node, // @TODO: DOMString

  // Node
  'appendChild': Types.Node,
  'insertBefore': Types.Node,
  'normalize': Types.Node, // [https://developer.mozilla.org/zh-TW/docs/Web/API/Node/normalize] The Node.normalize() method puts the specified node and all of its sub-tree into a "normalized" form. In a normalized sub-tree, no text nodes in the sub-tree are empty and there are no adjacent text nodes.
  'removeChild': Types.Node,
  'replaceChild': Types.Node,

  /* Style */

  // Element
  'animate': Types.Style
}