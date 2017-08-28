/// <reference path='../tracker/public/ActionStore.d.ts'/>
/// <reference path='../tracker/public/TrackIDFactory.d.ts'/>

interface State {
  trackid: TrackID,
  records: ActionRecord[]
}