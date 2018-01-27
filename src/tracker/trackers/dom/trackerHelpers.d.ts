/// <reference path='../../private/ActionMap.d.ts'/>
/// <reference path='./tracker.d.ts'/> 

type RecordInfo = {
  caller: ActionTarget,
  target: Target,
  action: Action,
  args?: any[],
  merge?: string
}

type Decorator = (
  target: Target,
  action: Action,
  actionFunc: (this: ActionTarget, ...args: any[]) => any
) => (this: ActionTarget, ...args: any[]) => any
