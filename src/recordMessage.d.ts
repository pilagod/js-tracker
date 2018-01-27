type RecordMessage =
  RecordWrapMessage
  | RecordDataMessage

interface RecordWrapMessage {
  state: 'record_start' | 'record_end'
  data: RecordWrap
}

type RecordWrap = {
  loc: SourceLocation
}

interface RecordDataMessage {
  state: 'record',
  data: RecordData
}

type RecordData = {
  trackid: string,
  type: ActionType,
  merge?: string
}