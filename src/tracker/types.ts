// HTMLElement -> Element (ChildNode) -> Node -> EventTarget
// categories: attribute, behavior, event, node, style
// attributes, classList, (dataset, style) proxy only

const Attribute = 1 << 0
const Behavior = 1 << 1
const Event = 1 << 2
const Node = 1 << 3
const Style = 1 << 4

export const Types: object = {
  Attribute, Behavior, Event, Node, Style
}
export const TypesCls: {
  'HTMLElement': object,
  'Element': object,
  'Node': object,
  'EventTarget': object,

  // DOMStringMap (dataset) has empty prototype
  'Attr': object, // attributes[0]
  'CSSStyleDeclaration': object, // style
  'DOMTokenList': object, // classList
  'NamedNodeMap': object, // attributes
} = {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLElement
    'HTMLElement': {
      // properties
      'accessKey': Attribute,
      'contentEditable': Attribute,
      'dir': Attribute,
      'draggable': Attribute,
      'hidden': Attribute,
      'lang': Attribute,
      'spellcheck': Attribute,
      'tabIndex': Attribute,
      'title': Attribute,
      'translate': Attribute,

      'onabort': Event,
      'onanimationcancel': Event,
      'onanimationend': Event,
      'onanimationiteration': Event,
      'onauxclick': Event,
      'onblur': Event,
      'onchange': Event,
      'onclick': Event,
      'onclose': Event,
      'oncontextmenu': Event,
      'oncopy': Event,
      'oncut': Event,
      'ondblclick': Event,
      'onerror': Event,
      'onfocus': Event,
      'ongotpointercapture': Event,
      'oninput': Event,
      'onkeydown': Event,
      'onkeypress': Event,
      'onkeyup': Event,
      'onload': Event,
      'onloadend': Event,
      'onloadstart': Event,
      'onlostpointercapture': Event,
      'onmousedown': Event,
      'onmousemove': Event,
      'onmouseout': Event,
      'onmouseover': Event,
      'onmouseup': Event,
      'onpaste': Event,
      'onpointercancel': Event,
      'onpointerdown': Event,
      'onpointerenter': Event,
      'onpointerleave': Event,
      'onpointermove': Event,
      'onpointerout': Event,
      'onpointerover': Event,
      'onpointerup': Event,
      'onreset': Event,
      'onresize': Event,
      'onscroll': Event,
      'onselect': Event,
      'onselectionchange': Event,
      'onselectstart': Event,
      'onsubmit': Event,
      'ontouchcancel': Event,
      'ontouchmove': Event,
      'ontouchstart': Event,
      'ontransitioncancel': Event,
      'ontransitionend': Event,

      // methods
      'blur': Behavior,
      'click': Behavior,
      'focus': Behavior,
      'forceSpellCheck': Behavior,
    },
    // https://developer.mozilla.org/zh-TW/docs/Web/API/Element
    'Element': {
      // properties
      'id': Attribute,
      'name': Attribute,
      'slot': Attribute,

      'scrollTop': Behavior,
      'scrollLeft': Behavior,

      'onwheel': Event,

      'innerHTML': Node,
      'outerHTML': Node,

      'className': Style,

      // methods
      'removeAttribute': Attribute,
      'removeAttributeNode': Attribute,
      'removeAttributeNS': Attribute,
      'setAttribute': Attribute,
      'setAttributeNode': Attribute,
      'setAttributeNodeNS': Attribute,
      'setAttributeNS': Attribute,

      'scrollIntoView': Behavior,

      'append': Node,
      'attachShadow': Node,
      'insertAdjacentElement': Node,
      'insertAdjacentHTML': Node,
      'insertAdjacentText': Node,
      'prepend': Node,

      // ChildNode https://developer.mozilla.org/zh-TW/docs/Web/API/ChildNode
      // Chrome sets these methods in Element
      'remove': Node,
      'before': Node,
      'after': Node,
      'replaceWith': Node,

      'animate': Style
    },
    // https://developer.mozilla.org/zh-TW/docs/Web/API/Node
    'Node': {
      // properties
      'nodeValue': Attribute,

      'textContent': Node,
      'innerText': Node,

      // methods
      'appendChild': Node,
      'insertBefore': Node,
      'normalize': Node, // [https://developer.mozilla.org/zh-TW/docs/Web/API/Node/normalize] The Node.normalize() method puts the specified node and all of its sub-tree into a "normalized" form. In a normalized sub-tree, no text nodes in the sub-tree are empty and there are no adjacent text nodes.
      'removeChild': Node,
      'replaceChild': Node,
    },
    // https://developer.mozilla.org/zh-TW/docs/Web/API/EventTarget
    'EventTarget': {
      // methods
      'addEventListener': Event,
      'dispatchEvent': Event,
      'removeEventListener': Event,
    },

    // https://developer.mozilla.org/zh-TW/docs/Web/API/Attr
    'Attr': {
      // properties
      'value': Attribute | Style
    },
    // https://developer.mozilla.org/zh-TW/docs/Web/API/CSSStyleDeclaration
    'CSSStyleDeclaration': {
      // methods
      'removeProperty': Style,
      'setProperty': Style
    },
    // https://developer.mozilla.org/zh-TW/docs/Web/API/DOMTokenList
    'DOMTokenList': {
      // @NOTE: for classList only now
      // methods
      'add': Attribute | Style,
      'remove': Attribute | Style,
      'replace': Attribute | Style,
      'toggle': Attribute | Style
    },
    // https://developer.mozilla.org/zh-TW/docs/Web/API/NamedNodeMap
    'NamedNodeMap': {
      // methods
      'setNamedItem': Attribute | Style,
      'removeNamedItem': Attribute | Style,
      'setNamedItemNS': Attribute | Style,
      'removeNamedItemNS': Attribute | Style
    },
  }