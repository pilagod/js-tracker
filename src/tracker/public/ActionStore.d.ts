/// <reference path='./ActionType.d.ts'/>

type TrackID = string

type ActionInfo = {
  trackid: TrackID,
  type: ActionType,
  loc: SourceLocation,
  merge?: TrackID,
}

type SourceLocation = {
  scriptUrl: string;
  lineNumber: number;
  columnNumber: number;
}

type ActionRecord = {
  key: string;
  type: ActionType;
  loc: SourceLocation;
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