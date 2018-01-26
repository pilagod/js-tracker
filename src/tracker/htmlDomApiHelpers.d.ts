/// <reference path='./private/ActionMap.d.ts'/>
/// <reference path='./htmlDomApis.d.ts'/> 

type Decorator = (
  target: Target,
  action: Action,
  actionFunc: (this: ActionTarget, ...args: any[]) => any
) => (this: ActionTarget, ...args: any[]) => any
