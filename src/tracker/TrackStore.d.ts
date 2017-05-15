type TrackTarget =
  HTMLElement
  | Attr
  | CSSStyleDeclaration
  | DOMTokenList
  | NamedNodeMap

type TrackData = {
  trackid: string,
  target: string,
  action: PropertyKey,
  actionTag?: string,
  stacktrace?: any
}

type TrackStoreData = {
}

interface ITrackStore {
  register(trackData: TrackData): void;
  retrieve(trackid: string): any;
}


