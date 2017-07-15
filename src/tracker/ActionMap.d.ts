/// <reference path='./tracker.d.ts'/>
/// <reference path='./ActionTypes.d.ts' />

type ActionTagMap = {
  'default': ActionTypes;
  [tag: string]: ActionTypes;
}

interface IActionMap {
  filterActionType(
    target: string,
    action: string,
    actionTag?: string
  ): ActionTypes;

  has(
    target: string,
    action: string
  ): boolean;

  visit(
    callback: (target: Target, actionMap?: object) => void
  ): void;
}