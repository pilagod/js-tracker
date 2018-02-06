import * as StackTrace from 'stacktrace-js'
import MessageBroker from '../private/MessageBroker'

export function wrapActionWithSourceMessages(actionFunc: () => any) {
  const loc = getSourceLocationGivenDepth(3)

  try {
    recordStartWith(loc)
    return actionFunc()
  } catch (e) {
    throw (e)
  } finally {
    recordEndWith(loc)
  }
}

function getSourceLocationGivenDepth(depth: number) {
  const stackframe = StackTrace.getSync()[depth]

  return {
    scriptUrl: stackframe.fileName,
    lineNumber: stackframe.lineNumber,
    columnNumber: stackframe.columnNumber,
  }
}

function recordStartWith(loc: SourceLocation) {
  MessageBroker.send({
    state: 'record_start',
    data: { loc }
  })
}

function recordEndWith(loc: SourceLocation) {
  MessageBroker.send({
    state: 'record_end',
    data: { loc }
  })
}