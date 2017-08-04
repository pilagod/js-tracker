/// <reference path='./tracker/ActionStore.d.ts'/>
/// <reference path='./tracker/TrackIDManager.d.ts'/>

type Message = {
  trackid: TrackID,
  records: ActionRecord[]
}
