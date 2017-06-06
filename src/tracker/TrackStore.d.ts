type Action = PropertyKey

type TrackTarget =
  HTMLElement
  | SVGElement
  | Element
  | Attr
  | CSSStyleDeclaration
  | DOMStringMap
  | DOMTokenList
  | NamedNodeMap

interface TrackTargetInf {
  _owner: Element;
}

type TrackData = {
  caller: TrackTarget,
  target: string,
  action: Action,
  actionTag?: string,
  merge?: string
}

type TrackInfo = {
  trackid: string,
  target: string,
  action: Action,
  stacktrace: StackTrace.StackFrame[],
  actionTag?: string,
  merge?: string
}

type TrackRecord = {
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

interface SVGElement {
  // @TODO: pull request to typescript repo
  readonly dataset: DOMStringMap
}
interface Element extends TrackTargetInf { }
interface Attr extends TrackTargetInf { }
interface CSSStyleDeclaration extends TrackTargetInf { }
interface DOMStringMap extends TrackTargetInf {
  // @NOTE: use any to bypass original map type
  _owner: any
}
interface DOMTokenList extends TrackTargetInf {
  _which: string;
}
interface NamedNodeMap extends TrackTargetInf { }