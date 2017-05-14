interface Attr {
  _owner: HTMLElement;
}

interface CSSStyleDeclaration {
  _owner: HTMLElement;
}

interface DOMTokenList {
  _owner: HTMLElement;
  _which: string;
}

interface NamedNodeMap {
  _owner: HTMLElement;
}

type TrackTarget =
  HTMLElement
  | Attr
  | CSSStyleDeclaration
  | DOMTokenList
  | NamedNodeMap

interface ITrackData {
  trackid: string,
  target: string,
  action: PropertyKey,
  actionTag?: string,
  stacktrace?: any
}