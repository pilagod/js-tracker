/// <reference path='../../../tracker/public/types/ActionType.d.ts'/>
/// <reference path='../../../tracker/public/types/TrackID.d.ts'/>
/// <reference path='../../../tracker/public/types/SourceLocation.d.ts'/>

type RecordStoreMessage = RecordStoreAddMessage

/* Record Add Message */

type RecordStoreAddMessage = {
  loc: SourceLocation,
  data: RecordStoreAddData[]
}
type RecordStoreAddData = {
  trackid: TrackID,
  type: ActionType,
  merge?: TrackID
}
