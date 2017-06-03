type Action = PropertyKey

type TrackTarget =
  HTMLElement
  | Attr
  | CSSStyleDeclaration
  | DOMTokenList
  | NamedNodeMap

interface TrackTargetInf {
  _owner: HTMLElement;
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
  actionTag?: string,
  merge?: string,
  stacktrace?: any
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

interface HTMLElement extends TrackTargetInf { }
interface Attr extends TrackTargetInf { }
interface CSSStyleDeclaration extends TrackTargetInf { }
interface DOMTokenList extends TrackTargetInf {
  _which: string;
}
interface NamedNodeMap extends TrackTargetInf { }