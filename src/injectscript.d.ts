type TrackSwitchValue<T> = T | { value: T; }

interface ActionTarget {
  _owner: Owner;
}

interface Owner {
  readonly dataset: {
    [key: string]: string;
    _trackid?: TrackID;
    _isShadow?: string;
  };
}

/* Owner */

interface HTMLElement extends Owner { }

/* ActionTarget */

interface Window extends ActionTarget { }
interface Document extends ActionTarget { }
interface Element extends ActionTarget { }
interface Attr extends ActionTarget { }
interface CSSStyleDeclaration extends ActionTarget {
  _proxy: CSSStyleDeclaration;
}
interface DOMStringMap extends ActionTarget {
  // @NOTE: use <any> to bypass index signature
  // from DOMStringMap in typescript/lib/lib.es6.d.ts
  _owner: Owner | any;
  _proxy: DOMStringMap | any;
}
interface DOMTokenList extends ActionTarget {
  value: string; // @TODO: pull request to typescript repo
  _which: string;
}
interface NamedNodeMap extends ActionTarget { }

