/// <reference path='../types/ActionTarget.d.ts'/>

import ActionType from '../public/ActionType'
import ActionTagMap from './ActionTagMap'

const {
  Attr,
  Behav,
  Event,
  Node,
  Style
} = ActionType

type ActionTagMap = {
  'default': ActionType;
  [tag: string]: ActionType;
}

// @NOTE: those actions whose type determined by argument or property
// (1) Element.attributes methods (e.g. setAttr, removeAttr)
// (2) Attr value setter
const AttrActionTagMap: ActionTagMap = {
  'class': Style,
  'style': Style,
  'default': Attr
}

// @NOTE: those actions whose type determined by caller object
// (1) classList -> Style
// (2) others -> Attr
const DOMTokenListActionTagMap: ActionTagMap = {
  'classList': Style,
  'default': Attr
}

const ActionMap: {[target in Target]: object} = {
  'HTMLElement': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLElement

    /* properties */

    'accessKey': Attr,
    'contentEditable': Attr,
    'dir': Attr,
    'draggable': Attr,
    'hidden': Attr,
    // @NOTE: innerText on MDN is in Node.prototype,
    // but chrome put it in HTMLElement.prototype 
    'innerText': Attr | Node,
    'lang': Attr,
    'nonce': Attr,
    'outerText': Attr | Node,
    'spellcheck': Attr,
    'tabIndex': Attr,
    'title': Attr,
    'translate': Attr,

    'onabort': Event,
    'onanimationcancel': Event,
    'onanimationend': Event,
    'onanimationiteration': Event,
    'onauxclick': Event,
    'onblur': Event,
    'oncancel': Event,
    'oncanplay': Event,
    'oncanplaythrough': Event,
    'onchange': Event,
    'onclick': Event,
    'onclose': Event,
    'oncontextmenu': Event,
    'oncopy': Event,
    'oncuechange': Event,
    'oncut': Event,
    'ondblclick': Event,
    'ondrag': Event,
    'ondragend': Event,
    'ondragenter': Event,
    'ondragleave': Event,
    'ondragover': Event,
    'ondragstart': Event,
    'ondrop': Event,
    'ondurationchange': Event,
    'onemptied': Event,
    'onended': Event,
    'onerror': Event,
    'onfocus': Event,
    'ongotpointercapture': Event,
    'oninput': Event,
    'oninvalid': Event,
    'onkeydown': Event,
    'onkeypress': Event,
    'onkeyup': Event,
    'onload': Event,
    'onloadeddata': Event,
    'onloadedmetadata': Event,
    'onloadend': Event,
    'onloadstart': Event,
    'onlostpointercapture': Event,
    'onmousedown': Event,
    'onmouseenter': Event,
    'onmouseleave': Event,
    'onmousemove': Event,
    'onmouseout': Event,
    'onmouseover': Event,
    'onmouseup': Event,
    'onmousewheel': Event,
    'onpause': Event,
    'onplay': Event,
    'onplaying': Event,
    'onprogress': Event,
    'onpaste': Event,
    'onpointercancel': Event,
    'onpointerdown': Event,
    'onpointerenter': Event,
    'onpointerleave': Event,
    'onpointermove': Event,
    'onpointerout': Event,
    'onpointerover': Event,
    'onpointerup': Event,
    'onratechange': Event,
    'onreset': Event,
    'onresize': Event,
    'onscroll': Event,
    'onseeked': Event,
    'onseeking': Event,
    'onselect': Event,
    'onselectionchange': Event,
    'onselectstart': Event,
    'onshow': Event,
    'onstalled': Event,
    'onsubmit': Event,
    'onsuspend': Event,
    'ontimeupdate': Event,
    'ontoggle': Event,
    'ontouchcancel': Event,
    'ontouchmove': Event,
    'ontouchstart': Event,
    'ontransitioncancel': Event,
    'ontransitionend': Event,
    'onvolumechange': Event,
    'onwaiting': Event,
    'onwheel': Event,

    /* methods */

    'blur': Behav | Event,
    'click': Behav | Event,
    'focus': Behav | Event,
    'forceSpellCheck': Behav,
  },
  'Element': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/Element

    /* properties */

    'id': Attr,
    'name': Attr,
    'slot': Attr,
    'scrollTop': Attr,
    'scrollLeft': Attr,

    'onbeforecopy': Event,
    'onbeforecut': Event,
    'onbeforepaste': Event,
    'oncopy': Event,
    'oncut': Event,
    'onpaste': Event,
    'onsearch': Event,
    'onselectstart': Event,
    'onwebkitfullscreenchange': Event,
    'onwebkitfullscreenerror': Event,

    'innerHTML': Attr | Node,
    'outerHTML': Attr | Node,

    'className': Style,

    /* methods */

    'removeAttribute': AttrActionTagMap,
    'removeAttributeNode': AttrActionTagMap,
    'removeAttributeNS': AttrActionTagMap,
    'setAttribute': AttrActionTagMap,
    'setAttributeNode': AttrActionTagMap, // #anomaly
    'setAttributeNodeNS': AttrActionTagMap, // #anomaly
    'setAttributeNS': AttrActionTagMap,

    'scrollIntoView': Behav,
    'setPointerCapture': Behav | Event,

    'append': Node,
    'attachShadow': Node,
    'insertAdjacentElement': Node,
    'insertAdjacentHTML': Node,
    'insertAdjacentText': Node,
    'prepend': Node,

    // ChildNode https://developer.mozilla.org/zh-TW/docs/Web/API/ChildNode
    // Chrome keeps these methods in Element
    'remove': Node,
    'before': Node,
    'after': Node,
    'replaceWith': Node,

    // 'animate': Style,
  },
  'Node': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/Node

    /* properties */

    'nodeValue': Attr,

    'textContent': Attr | Node,

    /* methods */

    'appendChild': Node,
    'insertBefore': Node,
    'normalize': Node, // [https://developer.mozilla.org/zh-TW/docs/Web/API/Node/normalize] The Node.normalize() method puts the specified node and all of its sub-tree into a 'normalized' form. In a normalized sub-tree, no text nodes in the sub-tree are empty and there are no adjacent text nodes.
    'removeChild': Node,
    'replaceChild': Node,
  },
  'EventTarget': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/EventTarget

    /* methods */
    'dispatchEvent': Behav | Event,

    'addEventListener': Event,
    'removeEventListener': Event,
  },
  'Attr': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/Attr

    /* properties */

    'value': AttrActionTagMap // #anomaly
  },
  'CSSStyleDeclaration': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/CSSStyleDeclaration
    // refer to HTMLElement.style

    /* methods */

    'removeProperty': Style,
    'setProperty': Style
  },
  'DOMStringMap': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/DOMStringMap
    // refer to HTMLElement.dataset
  },
  'DOMTokenList': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/DOMTokenList
    // refer to Element.classList

    /* properties */

    'value': DOMTokenListActionTagMap,

    /* methods */

    'add': DOMTokenListActionTagMap,
    'remove': DOMTokenListActionTagMap,
    'replace': DOMTokenListActionTagMap,
    'toggle': DOMTokenListActionTagMap
  },
  'NamedNodeMap': {
    // https://developer.mozilla.org/zh-TW/docs/Web/API/NamedNodeMap
    // refer to Element.attributes

    /* methods */

    'removeNamedItem': AttrActionTagMap,
    'removeNamedItemNS': AttrActionTagMap,
    'setNamedItem': AttrActionTagMap, // #anomaly
    'setNamedItemNS': AttrActionTagMap, // #anomaly
  },
}

const IActionMap = {
  getActionType({ caller, target, action, args = [] }: {
    caller: ActionTarget,
    target: Target,
    action: Action,
    args?: any[]
  }): ActionType {
    switch (target) {
      case 'CSSStyleDeclaration':
        return ActionType.Style
      case 'DOMStringMap':
        return ActionType.Attr
      default:
        if (this.has(target, action)) {
          const tag = ActionTagMap.fetchActionTag({ caller, target, action, args })
          const type = ActionMap[target][action]

          return tag ? (type[tag] || type['default']) : type
        }
        return ActionType.None
    }
  },

  has(target: Target, action: Action) {
    return !!(ActionMap[target] && ActionMap[target][action])
  },

  visit(
    callback: (target: Target, actionMap: object) => void
  ) {
    Object.keys(ActionMap).map(
      (target: Target) => {
        callback(target, ActionMap[target])
      }
    )
  }
}
export default IActionMap