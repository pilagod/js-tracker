/// <reference path='./tracker.d.ts'/>

type ActionTag = string | undefined
type ActionTags = string[]

interface IActionTagMap {
  has(target: Target, action: Action): boolean;
  fetchActionTag(
    caller: IActionTarget,
    target: Target,
    action: Action,
    args: any[]
  ): ActionTag;
}