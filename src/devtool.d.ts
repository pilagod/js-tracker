/// <reference path='./tracker/ActionStore.d.ts'/>
/// <reference path='./tracker/TrackIDManager.d.ts'/>

interface State {
  trackid: TrackID,
  records: ActionRecord[]
}