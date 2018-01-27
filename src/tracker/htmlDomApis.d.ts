interface ActionTarget {
  // @NOTE: symbol index is not supported yet
  // [owner: symbol]: Owner;
}
interface Window extends ActionTarget { }
interface Document extends ActionTarget { }
interface Element extends ActionTarget { }
interface Attr extends ActionTarget { }
interface CSSStyleDeclaration extends ActionTarget { }
interface DOMStringMap extends ActionTarget { }
interface DOMTokenList extends ActionTarget {
  value: string; // @TODO: pull request to typescript repo
}
interface NamedNodeMap extends ActionTarget { }