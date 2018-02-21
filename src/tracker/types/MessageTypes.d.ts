/* message between tracker, contentscirpt */

/* Record Message Types */

type RecordContextStartType = 'RECORD_CONTEXT_START'
type RecordContextEndType = 'RECORD_CONTEXT_END'
type RecordDataType = 'RECORD_DATA'

/* Record Messages */

type RecordMessage =
  RecordContextMessage
  | RecordDataMessage

/* Record Context Message */

type RecordContextMessage = {
  type: RecordContextStartType | RecordContextEndType
  data: RecordContext
}

type RecordContext = {
  loc: SourceLocation
}

/* Record Data Message */

type RecordDataMessage = {
  type: RecordDataType,
  data: RecordData
}

type RecordData = {
  trackid: string,
  type: ActionType,
  merge?: string
}