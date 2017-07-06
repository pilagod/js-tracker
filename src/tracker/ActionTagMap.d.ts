/// <reference path='./tracker.d.ts'/>

type ActionTag = string | undefined

interface IActionTagMap {
  has(target: Target, action: Action): boolean;
  parse(
    caller: IActionTarget,
    target: Target,
    action: Action,
    args: any[]
  ): ActionTag;
}