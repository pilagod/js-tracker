/// <reference path='./utils.d.ts'/> 

import { expect } from 'chai'
import * as StackTrace from 'stacktrace-js'

import OwnerManager from '../../src/tracker/private/OwnerManager'

export function makeExpectInfo(
  caller: ActionTarget,
  trackid: string,
  type: ActionType,
  loc: SourceLocation,
  merge?: string
) {
  return { caller, trackid, type, loc, merge }
}

export function matchActionInfo(got: ActionInfo, expected: ExpectInfo) {
  expect(
    OwnerManager
      .getOwner(expected.caller)
      .getTrackID()
  ).to.equal(expected.trackid)

  expect(got)
    .to.have.property('trackid')
    .to.equal(expected.trackid)

  expect(got)
    .to.have.property('type')
    .to.equal(expected.type)

  matchLocation(got.loc, expected.loc)

  if (expected.merge) {
    expect(got.merge).to.equal(expected.merge)
  }
}

function matchLocation(got: SourceLocation, expected: SourceLocation) {
  expect(got.scriptUrl).to.equal(expected.scriptUrl)
  expect(got.lineNumber).to.equal(expected.lineNumber)
}

export function getPrevLineSourceLocation(): SourceLocation {
  const loc = StackTrace.getSync()[1]

  return {
    scriptUrl: loc.fileName,
    lineNumber: loc.lineNumber - 1,
    columnNumber: loc.columnNumber
  }
}

export function makeTrackerMessageHandler() {
  const messages = []
  const trackerMessageHandler = (event: CustomEvent) => {
    messages.push(event.detail.info)
  }
  const resetMessages = () => {
    messages.length = 0
  }
  return {
    messages,
    resetMessages,
    trackerMessageHandler
  }
}