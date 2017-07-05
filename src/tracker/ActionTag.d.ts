/// <reference path='./tracker.d.ts'/>

interface IActionTag {
  has(target: Target, action: Action): boolean;
  parse(
    caller: ActionTarget,
    target: Target,
    action: Action,
    args: any[]
  ): string | undefined;
}