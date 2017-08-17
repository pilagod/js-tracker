/// <reference path='./tracker/ActionStore.d.ts'/>
/// <reference path='./tracker/TrackIDManager.d.ts'/>
/// <reference path='./MessageType.d.ts'/>

type Message = {
  type: MessageType,
  trackid: TrackID,
  records: ActionRecord[]
}
