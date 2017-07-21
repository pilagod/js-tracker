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

type TrackID = string

type ActionInfo = {
  trackid: TrackID,
  target: Target,
  action: Action,
  stacktrace: StackTrace.StackFrame[],
  actionTag?: string,
  merge?: TrackID
}

interface ActionTarget {
  _owner: Owner;
}

interface Owner {
  _trackid: string;
  _isShadow: boolean;
}

/**
 * Extend Native Interfaces
 */

// interface SVGElement {
//   readonly dataset: DOMStringMap; // @TODO: pull request to typescript repo
// }
interface Element extends Owner, ActionTarget { }
interface Attr extends ActionTarget { }
interface CSSStyleDeclaration extends ActionTarget {
  _proxy: CSSStyleDeclaration;
}
interface DOMStringMap extends ActionTarget {
  // @NOTE: bypass index signature of DOMStringMap in typescript/lib/lib.es6.d.ts
  _owner: Owner | any; // interface Owner 
  _proxy: DOMStringMap | any; // interface DOMStringMap
}
interface DOMTokenList extends ActionTarget {
  value: string; // @TODO: pull request to typescript repo
  _which: string;
}
interface NamedNodeMap extends ActionTarget { }