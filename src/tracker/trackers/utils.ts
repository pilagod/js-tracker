/// <reference path='../public/types/MessageTypes.d.ts'/>

import * as StackTrace from 'stacktrace-js'

import MessageBroker from '../private/MessageBroker'
import OwnerManager from '../private/OwnerManager'
import {
  ACTION_CONTEXT_START,
  ACTION_CONTEXT_END,
  ACTION_DATA
} from '../public/MessageTypes'

export function saveActionDataTo(target: ActionTarget, type: ActionType, merge?: TrackID) {
  const record: ActionData = {
    trackid: OwnerManager.getOrSetTrackIDOnItsOwner(target),
    type
  }
  if (merge) {
    record.merge = merge
  }
  MessageBroker.send({
    type: ACTION_DATA,
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
  context: ActionContext
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

function getCallerContext(): ActionContext {
  const stackframe = StackTrace.getSync()[2]

  return <ActionContext>{
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
  context: ActionContext
) {
  try {
    MessageBroker.send({
      type: ACTION_CONTEXT_START,
      data: context
    })
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    MessageBroker.send({
      type: ACTION_CONTEXT_END,
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