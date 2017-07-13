/// <reference path='./tracker.d.ts'/>
/// <reference path='./ActionTypes.d.ts' />

interface IActionMap {
  getActionType(
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