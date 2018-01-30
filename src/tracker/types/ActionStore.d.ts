// ActionInfo -> ActionStore -> ActionRecord

type ActionInfo = {
  trackid: TrackID,
  type: ActionType,
  loc: SourceLocation,
  merge?: TrackID,
}

type ActionRecord = {
  key: string;
  type: ActionType;
  loc: SourceLocation;
  code: string;
}

type TrackID = string

type SourceLocation = {
  scriptUrl: string;
  lineNumber: number;
  columnNumber: number;
}

interface IActionStore {
  get(trackid: TrackID): ActionRecord[];
  registerFromActionInfo(info: ActionInfo): Promise<boolean>;
}