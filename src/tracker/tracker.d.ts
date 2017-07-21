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

type TrackSwitchValue<T> = T | { value: T; }

interface ActionTarget {
  _owner: Owner;
}

interface Owner {
  // @NOTE: trackid need to be saved on native property
  // extended property can't be figured by devtools
  readonly dataset: {
    [key: string]: string;
    _trackid?: TrackID;
    _isShadow?: string;
  };
}

/**
 * Extend Native Interfaces
 */

/* Owner */

// interface SVGElement {
//   readonly dataset: DOMStringMap; // @TODO: pull request to typescript repo
// }
interface HTMLElement extends Owner { }

/* ActionTarget */

interface Element extends ActionTarget { }
interface Attr extends ActionTarget { }
interface CSSStyleDeclaration extends ActionTarget {
  _proxy: CSSStyleDeclaration;
}
interface DOMStringMap extends ActionTarget {
  // @NOTE: use any to bypass index signature definition 
  // of DOMStringMap in typescript/lib/lib.es6.d.ts
  _owner: Owner | any;
  _proxy: DOMStringMap | any;
}
interface DOMTokenList extends ActionTarget {
  value: string; // @TODO: pull request to typescript repo
  _which: string;
}
interface NamedNodeMap extends ActionTarget { }