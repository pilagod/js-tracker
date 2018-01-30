type Target =
  'HTMLElement'
  | 'Element'
  | 'Node'
  | 'EventTarget'
  | 'Attr' // attr (e.g. attributes[0])
  | 'CSSStyleDeclaration' // style
  | 'DOMStringMap' // dataset
  | 'DOMTokenList' // classList
  | 'NamedNodeMap' // attributes

type Action = PropertyKey

interface ActionTarget {
  // @NOTE: symbol index is not supported yet
  // [owner: symbol]: Owner;
}
interface Window extends ActionTarget { }
interface Document extends ActionTarget { }
interface Element extends ActionTarget { }
interface Attr extends ActionTarget { }
interface CSSStyleDeclaration extends ActionTarget { }
interface DOMStringMap extends ActionTarget { }
interface DOMTokenList extends ActionTarget {
  // @TODO: pull request to typescript repo
  value: string;
}
interface NamedNodeMap extends ActionTarget { }

