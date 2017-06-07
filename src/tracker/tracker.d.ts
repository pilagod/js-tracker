type Action = PropertyKey

type ActionTarget =
  HTMLElement
  | SVGElement
  | Element
  | Attr
  | CSSStyleDeclaration
  | DOMStringMap
  | DOMTokenList
  | NamedNodeMap

interface Owner {
  _trackid: string;
  _isShadow: boolean;
}

interface ActionTargetInf {
  _owner: Owner;
}

type ActionInfo = {
  trackid: string,
  target: string,
  action: Action,
  stacktrace: StackTrace.StackFrame[],
  actionTag?: string,
  merge?: string
}

type ActionRecord = {
}

/**
 * Extend Native Interfaces
 */

interface SVGElement {
  // @TODO: pull request to typescript repo
  readonly dataset: DOMStringMap
}
interface Element extends Owner, ActionTargetInf { }
interface Attr extends ActionTargetInf { }
interface CSSStyleDeclaration extends ActionTargetInf { }
interface DOMStringMap extends ActionTargetInf {
  // @NOTE: use any to bypass original map type
  _owner: any
}
interface DOMTokenList extends ActionTargetInf {
  _which: string;
}
interface NamedNodeMap extends ActionTargetInf { }