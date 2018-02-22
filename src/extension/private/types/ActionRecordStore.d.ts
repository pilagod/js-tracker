/// <reference path='../../../tracker/public/types/TrackID.d.ts'/>
/// <reference path='../../../tracker/public/types/SourceLocation.d.ts'/>

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

interface IActionRecordStore {
  get(trackid: TrackID): ActionRecord[];
  registerFromActionInfo(info: ActionInfo): Promise<boolean>;
}