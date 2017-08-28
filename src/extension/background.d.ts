/// <reference path='../tracker/public/ActionStore.d.ts'/>
/// <reference path='../tracker/public/TrackIDFactory.d.ts'/>
/// <reference path='./MessageType.d.ts'/>

type Message = {
  type: MessageType,
  trackid: TrackID,
  records: ActionRecord[]
}
