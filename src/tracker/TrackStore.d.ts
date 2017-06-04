type Action = PropertyKey

type TrackTarget =
  HTMLElement
  | SVGElement
  | Attr
  | CSSStyleDeclaration
  | DOMTokenList
  | NamedNodeMap

type Owner = HTMLElement | SVGElement

interface TrackTargetInf {
  _owner: Owner;
}

type TrackInfo = {
  caller: TrackTarget,
  target: string,
  action: Action,
  merge?: string
}

type TrackData = {
  trackid: string,
  target: string,
  action: Action,
  stacktrace: StackTrace.StackFrame[],
  actionTag?: string,
  merge?: string
}

type TrackStoreData = {
}

interface ITrackStore {
  register(trackData: TrackData): void;
  retrieve(trackid: string): any;
}

type TrackSwitchValue<T> = T | {
  off?: boolean;
  value: T;
}

/**
 * Extend Native Interfaces
 */

// interface HTMLElement extends TrackTargetInf { }
// interface SVGElement extends TrackTargetInf {
// @TODO: make pull request to typescript
// dataset: DOMStringMap
// }
interface SVGElement {
  dataset: DOMStringMap
}
interface Element extends TrackTargetInf { }
interface Attr extends TrackTargetInf { }
interface CSSStyleDeclaration extends TrackTargetInf { }
interface DOMTokenList extends TrackTargetInf {
  _which: string;
}
interface NamedNodeMap extends TrackTargetInf { }