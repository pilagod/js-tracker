/// <reference path='../types/RecordMessage.d.ts'/>

import * as StackTrace from 'stacktrace-js'

import MessageBroker from '../private/MessageBroker'
import OwnerManager from '../private/OwnerManager'

export function packActionInCallerContext(
  actionFunc: (...args: any[]) => any
): (...args: any[]) => any {
  return function (...args) {
    return callActionInGivenContext.call(this, actionFunc, args, getCallerContext())
  }
}

export function packActionInGivenContext(
  actionFunc: (...args: any[]) => any,
  context: RecordContext
): (...args: any[]) => any {
  return function (...args) {
    return callActionInGivenContext.call(this, actionFunc, args, context)
  }
}

export function packActionInIsolatedContext(
  actionFunc: (...args: any[]) => any,
): (...args: any[]) => any {
  return function (...args) {
    return callActionInIsolatedContext.call(this, actionFunc, args)
  }
}

export function saveRecordDataTo(target: ActionTarget, type: ActionType, merge?: TrackID) {
  const owner = OwnerManager.getOwner(target)

  if (!owner.hasTrackID()) {
    owner.setTrackID()
  }
  const record: RecordData = {
    trackid: owner.getTrackID(),
    type
  }
  if (merge) {
    record.merge = merge
  }
  MessageBroker.send({
    state: 'record',
    data: record
  })
}

function getCallerContext(): RecordContext {
  const stackframe = StackTrace.getSync()[2]

  return <RecordContext>{
    loc: {
      scriptUrl: stackframe.fileName,
      lineNumber: stackframe.lineNumber,
      columnNumber: stackframe.columnNumber
    }
  }
}

function callActionInGivenContext(
  actionFunc: (...args: any[]) => any,
  args: any[],
  context: RecordContext
) {
  try {
    MessageBroker.send({
      state: 'record_start',
      data: context
    })
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    MessageBroker.send({
      state: 'record_end',
      data: context
    })
  }
}

function callActionInIsolatedContext(
  actionFunc: (...args: any[]) => any,
  args: any[]
) {
  try {
    MessageBroker.stackSnapshot()
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    MessageBroker.restoreSnapshot()
  }
}
