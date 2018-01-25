/// <reference path='../../src/tracker/index.d.ts'/> 
/// <reference path='../../src/tracker/public/ActionType.d.ts'/>
/// <reference path='../../src/tracker/public/ActionStore.d.ts'/>

type ExpectInfo = {
  caller: ActionTarget,
  trackid: string,
  type: ActionType,
  loc: SourceLocation,
  merge?: string,
}