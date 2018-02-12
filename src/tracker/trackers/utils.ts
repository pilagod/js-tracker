import * as StackTrace from 'stacktrace-js'

import MessageBroker from '../private/MessageBroker'
import OwnerManager from '../private/OwnerManager'

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

export function saveRecordDataTo(target: ActionTarget, type: ActionType, merge?: TrackID) {
  try {
    const owner = OwnerManager.getOwner(target)

    if (!owner.hasTrackID()) {
      owner.setTrackID()
    }
    const record: RecordData = { trackid: owner.getTrackID(), type }

    if (merge) {
      record.merge = merge
    }
    MessageBroker.send({ state: 'record', data: record })
  } catch (e) {
    console.log('error:', e, target)
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
  MessageBroker.send({ state: 'record_start', data: { loc } })
}

function recordEndWith(loc: SourceLocation) {
  MessageBroker.send({ state: 'record_end', data: { loc } })
}