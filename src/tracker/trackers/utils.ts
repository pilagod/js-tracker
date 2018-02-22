/// <reference path='../private/types/ActionData.d.ts'/>

import * as StackTrace from 'stacktrace-js'

import ActionRecorder from '../private/ActionRecorder'
import OwnerManager from '../private/OwnerManager'

export function saveActionDataTo(target: ActionTarget, type: ActionType, merge?: TrackID) {
  const data: ActionAddData = {
    trackid: OwnerManager.getOrSetTrackIDOnItsOwner(target),
    type
  }
  if (merge) {
    data.merge = merge
  }
  ActionRecorder.add(data)
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
  context: SourceLocation
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

function getCallerContext(): SourceLocation {
  const stackframe = StackTrace.getSync()[2]

  return {
    scriptUrl: stackframe.fileName,
    lineNumber: stackframe.lineNumber,
    columnNumber: stackframe.columnNumber
  }
}

function callActionInGivenContext(
  actionFunc: (...args: any[]) => any,
  args: any[],
  context: SourceLocation
) {
  try {
    ActionRecorder.startRecording(context)
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    ActionRecorder.stopRecording(context)
  }
}

function callActionInIsolatedContext(
  actionFunc: (...args: any[]) => any,
  args: any[]
) {
  try {
    ActionRecorder.saveSnapshot()
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    ActionRecorder.restoreSnapshot()
  }
}

function callActionInNonTrackingContext(
  actionFunc: (...args: any[]) => any,
  args: any[]
) {
  try {
    ActionRecorder.startBlocking()
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    ActionRecorder.stopBlocking()
  }
}

function callActionInTrackingContext(
  actionFunc: (...args: any[]) => any,
  args: any[]
) {
  const isInNonTrackingContext = ActionRecorder.isBlocking()

  try {
    if (isInNonTrackingContext) {
      ActionRecorder.stopBlocking()
    }
    return actionFunc.apply(this, args)
  } catch (e) {
    throw (e)
  } finally {
    if (isInNonTrackingContext) {
      ActionRecorder.startBlocking()
    }
  }
}