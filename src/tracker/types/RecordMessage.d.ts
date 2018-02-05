/* message between tracker, contentscirpt */

type RecordMessage =
  RecordSourceMessage
  | RecordDataMessage

type RecordSourceMessage = {
  state: 'record_start' | 'record_end'
  data: RecordSource
}

type RecordSource = {
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