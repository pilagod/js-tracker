/// <reference path='./tracker/ActionStore.d.ts'/>
/// <reference path='./tracker/TrackIDFactory.d.ts'/>
/// <reference path='./tracker/types/MessageType.d.ts'/>

type Message = {
  type: MessageType,
  trackid: TrackID,
  records: ActionRecord[]
}
