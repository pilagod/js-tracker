/* message between tracker, contentscirpt */

type RecordMessage =
  RecordContextMessage
  | RecordDataMessage

type RecordContextMessage = {
  type: 'record_start' | 'record_end'
  data: RecordContext
}

type RecordContext = {
  loc: SourceLocation
}

type RecordDataMessage = {
  type: 'record',
  data: RecordData
}

type RecordData = {
  trackid: string,
  type: ActionType,
  merge?: string
}