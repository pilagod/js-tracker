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

interface IActionTarget {
  _owner: Owner;
}

interface Owner {
  _trackid: string;
  _isShadow: boolean;
}

type ActionInfo = {
  trackid: string,
  target: Target,
  action: Action,
  stacktrace: StackTrace.StackFrame[],
  actionTag?: string,
  merge?: string
}

type ActionRecord = {
}

/**
 * Extend Native Interfaces
 */

interface SVGElement {
  readonly dataset: DOMStringMap; // @TODO: pull request to typescript repo
}
interface Element extends Owner, IActionTarget { }
interface Attr extends IActionTarget { }
interface CSSStyleDeclaration extends IActionTarget {
  _proxy: CSSStyleDeclaration;
}
interface DOMStringMap extends IActionTarget {
  // @NOTE: bypass index signature of DOMStringMap in typescript/lib/lib.es6.d.ts
  _owner: any; // interface Owner 
  _proxy: any; // interface DOMStringMap
}
interface DOMTokenList extends IActionTarget {
  value: string; // @TODO: pull request to typescript repo
  _which: string;
}
interface NamedNodeMap extends IActionTarget { }