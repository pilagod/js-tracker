type Action = PropertyKey

type TrackTarget =
  HTMLElement
  | Attr
  | CSSStyleDeclaration
  | DOMTokenList
  | NamedNodeMap

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


