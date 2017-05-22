interface HTMLElement {
  _owner: HTMLElement
}

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

type TrackSwitchValue<T> = T | {
  off?: boolean;
  value: T;
}