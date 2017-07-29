/// <reference path='./tracker.d.ts'/>
/// <reference path='./ActionType.d.ts' />

type ActionTagMap = {
  'default': ActionType;
  [tag: string]: ActionType;
}

interface IActionMap {
  filterActionType(
    target: Target,
    action: Action,
    actionTag?: string
  ): ActionType;

  has(
    target: string,
    action: string
  ): boolean;

  visit(
    callback: (target: Target, actionMap?: object) => void
  ): void;
}