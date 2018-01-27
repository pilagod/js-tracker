import { expect } from 'chai'
import * as StackTrace from 'stacktrace-js'

import OwnerManager from '../../src/tracker/private/OwnerManager'
import {
  attachListenerTo,
  detachListenerFrom
} from '../../src/tracker/private/NativeUtils'

export function getPrevLineSourceLocation(): SourceLocation {
  const loc = StackTrace.getSync()[1]

  return {
    scriptUrl: loc.fileName,
    lineNumber: loc.lineNumber - 1,
    columnNumber: loc.columnNumber
  }
}

export function createRecord(
  trackid: string,
  type: ActionType,
  merge?: string
): RecordData {
  const record: RecordData = { trackid, type }

  if (merge) {
    record.merge = merge
  }
  return record
}

export function getOwnerOf(target: ActionTarget) {
  return OwnerManager.getOwner(target)
}

export class TrackerMessageReceiver {
  private sender: EventTarget
  private messages: RecordMessage[]

  constructor(sender: EventTarget) {
    this.messages = []
    this.sender = sender
  }

  /* public */

  public setup() {
    attachListenerTo(this.sender, 'js-tracker', this.messageHandler)
  }

  public teardown() {
    detachListenerFrom(this.sender, 'js-tracker', this.messageHandler)
  }

  public reset() {
    this.messages = []
  }

  public verifyMessageStream(loc: SourceLocation, data: RecordData | RecordData[]) {
    this.verifyMessageWrap(loc)

    Array.prototype.concat.call([], data).map((datum) => {
      const record = { state: 'record', data: datum }
      expect(this.messages).to.include(record)
    })
  }

  public verifyOnlyWrapMessageStream(loc: SourceLocation) {
    this.verifyMessageWrap(loc)

    const records = this.messages.filter(({ state }) => state === 'record')

    expect(records).to.have.length(0)
  }

  public verifyEmptyMessageStream() {
    expect(this.messages).to.have.length(0)
  }

  /* private */

  private verifyMessageWrap(loc: SourceLocation) {
    const start = <RecordWrapMessage>this.messages[0]
    expect(start.state).to.equal('record_start')
    expect(start.data.loc.scriptUrl).to.equal(loc.scriptUrl)
    expect(start.data.loc.lineNumber).to.equal(loc.lineNumber)

    const end = <RecordWrapMessage>this.messages.slice(-1)[0]
    expect(end.state).to.equal('record_end')
    expect(end.data.loc.scriptUrl).to.equal(loc.scriptUrl)
    expect(end.data.loc.lineNumber).to.equal(loc.lineNumber)
  }

  private messageHandler = (event: CustomEvent) => {
    this.messages.push(event.detail.record)
  }
}