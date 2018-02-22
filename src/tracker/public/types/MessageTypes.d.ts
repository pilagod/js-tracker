/* message between tracker, contentscirpt */

/* Action Message Types */

type ActionContextStartType = 'ACTION_CONTEXT_START'
type ActionContextEndType = 'ACTION_CONTEXT_END'
type ActionDataType = 'ACTION_DATA'

/* Action Messages */

type ActionMessage =
  ActionContextMessage
  | ActionDataMessage

/* Action Context Message */

type ActionContextMessage = {
  type: ActionContextStartType | ActionContextEndType
  data: ActionContext
}

type ActionContext = {
  loc: SourceLocation
}

/* Action Data Message */

type ActionDataMessage = {
  type: ActionDataType,
  data: ActionData
}

type ActionData = {
  trackid: string,
  type: ActionType,
  merge?: string
}