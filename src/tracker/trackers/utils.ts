import * as StackTrace from 'stacktrace-js'
import MessageBroker from '../private/MessageBroker'
// import { sendMessageToContentScript } from '../private/NativeUtils'

export function recordWrapper(action: () => any) {
  const loc = getSourceLocationGivenDepth(3)

  try {
    recordStart(loc)
    return action()
  } catch (e) {
    throw (e)
  } finally {
    recordEnd(loc)
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

function recordStart(loc: SourceLocation) {
  MessageBroker.send({
    state: 'record_start',
    data: { loc }
  })
  // sendMessageToContentScript({
  //   state: 'record_start',
  //   data: { loc }
  // })
}

function recordEnd(loc: SourceLocation) {
  MessageBroker.send({
    state: 'record_end',
    data: { loc }
  })
  // sendMessageToContentScript({
  //   state: 'record_end',
  //   data: { loc }
  // })
}