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

interface ActionTargetInf {
  _owner: Element;
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
interface Element extends ActionTargetInf { }
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