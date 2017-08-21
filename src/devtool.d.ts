/// <reference path='./tracker/ActionStore.d.ts'/>
/// <reference path='./tracker/TrackIDFactory.d.ts'/>

interface State {
  trackid: TrackID,
  records: ActionRecord[]
}