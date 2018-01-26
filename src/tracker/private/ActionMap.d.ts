/// <reference path='../public/ActionType.d.ts' />
/// <reference path='../htmlDomApis.d.ts'/>

type Target =
  'HTMLElement'
  | 'Element'
  | 'Node'
  | 'EventTarget'
  | 'Attr' // attr (e.g. attributes[0])
  | 'CSSStyleDeclaration' // style
  | 'DOMStringMap' // dataset
  | 'DOMTokenList' // classList
  | 'NamedNodeMap' // attributes

type Action = PropertyKey

type ActionTagMap = {
  'default': ActionType;
  [tag: string]: ActionType;
}

interface IActionMap {
  getActionType(
    data: {
      caller: ActionTarget,
      target: Target,
      action: Action,
      args?: any[]
    }
  ): ActionType;

  has(
    target: string,
    action: string
  ): boolean;

  visit(
    callback: (target: Target, actionMap?: object) => void
  ): void;
}