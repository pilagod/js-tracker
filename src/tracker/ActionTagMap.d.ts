/// <reference path='./ActionMap.d.ts'/>
/// <reference path='../injectscript.d.ts'/>

type ActionTag = string | undefined

type ActionTags = string[]

interface IActionTagMap {
  has(
    target: Target,
    action: Action
  ): boolean;

  fetchActionTag(
    caller: ActionTarget,
    target: Target,
    action: Action,
    args: any[]
  ): ActionTag;
}