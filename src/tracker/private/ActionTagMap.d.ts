/// <reference path='../htmlDomApis.d.ts'/>
/// <reference path='./ActionMap.d.ts'/>

type ActionTag = string | undefined

type ActionTags = string[]

interface IActionTagMap {
  has(
    target: Target,
    action: Action
  ): boolean;

  fetchActionTag(
    data: {
      caller: ActionTarget,
      target: Target,
      action: Action,
      args?: any[]
    }
  ): ActionTag;
}