/// <reference path='./tracker.d.ts'/>

interface IActionMap {
  visit(
    callback: (target: Target, actionMap?: object) => void
  ): void;
  has(target: Target, action: Action): boolean;
}