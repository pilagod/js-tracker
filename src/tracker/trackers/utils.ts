/// <reference path='../types/MessageTypes.d.ts'/>

import * as StackTrace from 'stacktrace-js'

import MessageBroker from '../private/MessageBroker'
import OwnerManager from '../private/OwnerManager'
import {
  RECORD_CONTEXT_START,
  RECORD_CONTEXT_END,
  RECORD_DATA
} from '../public/MessageTypes'

export function saveRecordDataTo(target: ActionTarget, type: ActionType, merge?: TrackID) {
  const record: RecordData = {
    trackid: OwnerManager.getOrSetTrackIDOnItsOwner(target),
    type
  }
  if (merge) {
    record.merge = merge
  }
  MessageBroker.send({
    type: RECORD_DATA,
    data: record
  })
}

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

export function packActionInNonTrackingContext(
  actionFunc: (...args: any[]) => any
): (...args: any[]) => any {
  return function (...args) {
    return callActionInNonTrackingContext.call(this, actionFunc, args)
  }
}

export function packActionInTrackingContext(
  actionFunc: (...args: any[]) => any
): (...args: any[]) => any {
  return function (...args) {
    return callActionInTrackingContext.call(this, actionFunc, args)
  }
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
      type: RECORD_CONTEXT_START,
      data: context
    })
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    MessageBroker.send({
      type: RECORD_CONTEXT_END,
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

function callActionInNonTrackingContext(
  actionFunc: (...args: any[]) => any,
  args: any[]
) {
  try {
    MessageBroker.startBlocking()
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    MessageBroker.stopBlocking()
  }
}

function callActionInTrackingContext(
  actionFunc: (...args: any[]) => any,
  args: any[]
) {
  const isInNonTrackingContext = MessageBroker.isBlocking()

  try {
    if (isInNonTrackingContext) {
      MessageBroker.stopBlocking()
    }
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    if (isInNonTrackingContext) {
      MessageBroker.startBlocking()
    }
  }
}