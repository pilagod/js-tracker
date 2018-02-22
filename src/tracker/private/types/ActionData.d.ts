/// <reference path='../../public/types/ActionType.d.ts'/>
/// <reference path='../../public/types/TrackID.d.ts'/> 

type ActionData = ActionAddData

type ActionAddData = {
  trackid: TrackID,
  type: ActionType,
  merge?: TrackID
}