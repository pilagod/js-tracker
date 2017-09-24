/// <reference path='./ActionType.d.ts'/>
/// <reference path='./TrackIDFactory.d.ts'/>
/// <reference path='../private/ActionMap.d.ts'/>

type ActionInfo = {
  trackid: TrackID,
  target: Target,
  action: Action,
  actionTag?: string,
  merge?: TrackID,
  stacktrace: StackTrace.StackFrame[]
}

type ActionRecord = {
  key: string;
  type: ActionType;
  source: Source;
}

type Source = {
  loc: {
    scriptUrl: string;
    lineNumber: number;
    columnNumber: number;
  }
  code: string;
}

interface IActionStore {
  get(
    trackid: TrackID
  ): ActionRecord[];

  registerFromActionInfo(
    info: ActionInfo
  ): Promise<boolean>;
}