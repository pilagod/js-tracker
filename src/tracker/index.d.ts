/// <reference path='./TrackIDManager.d.ts'/>

type TrackSwitchValue<T> = T | { value: T; }

interface ActionTarget {
  // @NOTE: symbol index is not supported yet
  _owner: Owner;
}

interface Owner {
  readonly dataset: {
    [key: string]: string;
    // @NOTE: element using $0 to get in devtool can only access those 
    // properties natively defined on the element, trackid can't be
    // an alone extended property, so I store it on dataset 
    _trackid?: TrackID;
  };
  _isShadow?: boolean;
}

/* Owner */

interface HTMLElement extends Owner { }

/* ActionTarget */

interface Window extends ActionTarget { }
interface Document extends ActionTarget { }
interface Element extends ActionTarget { }
interface Attr extends ActionTarget { }
interface CSSStyleDeclaration extends ActionTarget { }
interface DOMStringMap extends ActionTarget {
  // @NOTE: use <any> to bypass index signature
  // from DOMStringMap in typescript/lib/lib.es6.d.ts
  _owner: Owner | any;
}
interface DOMTokenList extends ActionTarget {
  value: string; // @TODO: pull request to typescript repo
  _which: string;
}
interface NamedNodeMap extends ActionTarget { }

