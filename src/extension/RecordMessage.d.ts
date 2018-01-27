/* message between tracker, contentscirpt */

type RecordMessage =
  RecordWrapMessage
  | RecordDataMessage

type RecordWrapMessage = {
  state: 'record_start' | 'record_end'
  data: RecordWrap
}

type RecordWrap = {
  loc: SourceLocation
}

type RecordDataMessage = {
  state: 'record',
  data: RecordData
}

type RecordData = {
  trackid: string,
  type: ActionType,
  merge?: string
}