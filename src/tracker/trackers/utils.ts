/// <reference path='../types/RecordMessage.d.ts'/>

import * as StackTrace from 'stacktrace-js'

import MessageBroker from '../private/MessageBroker'
import OwnerManager from '../private/OwnerManager'

export function callActionInCallerContext(actionFunc: () => any) {
  return callActionInGivenContext(actionFunc, getCallerContext())
}

export function callActionInGivenContext(
  actionFunc: () => any,
  context: RecordContext
) {
  try {
    MessageBroker.send({
      state: 'record_start',
      data: context
    })
    return actionFunc.call(this)
  } catch (e) {
    throw (e)
  } finally {
    MessageBroker.send({
      state: 'record_end',
      data: context
    })
  }
}

export function saveRecordDataTo(target: ActionTarget, type: ActionType, merge?: TrackID) {
  const owner = OwnerManager.getOwner(target)

  if (!owner.hasTrackID()) {
    owner.setTrackID()
  }
  const record: RecordData = { trackid: owner.getTrackID(), type }

  if (merge) {
    record.merge = merge
  }
  MessageBroker.send({ state: 'record', data: record })
}

function getCallerContext(): RecordContext {
  const stackframe = StackTrace.getSync()[3]

  return <RecordContext>{
    loc: {
      scriptUrl: stackframe.fileName,
      lineNumber: stackframe.lineNumber,
      columnNumber: stackframe.columnNumber
    }
  }
}