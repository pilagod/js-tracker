import { expect } from 'chai'
import * as StackTrace from 'stacktrace-js'

import OwnerManager from '../../../src/tracker/private/OwnerManager'
import {
  attachListenerTo,
  detachListenerFrom
} from '../../../src/tracker/private/NativeUtils'

export function getPrevLineSourceLocation(): SourceLocation {
  const loc = StackTrace.getSync()[1]

  return {
    scriptUrl: loc.fileName,
    lineNumber: loc.lineNumber - 1,
    columnNumber: loc.columnNumber
  }
}

export function createRecord(trackid: string, type: ActionType, merge?: string) {
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

  public verifyMessages(loc: SourceLocation, data: RecordData | RecordData[]) {
    this.verifySourceMessage(loc)

    Array.prototype.concat.call([], data).map((datum) => {
      const record = { state: 'record', data: datum }
      expect(this.messages).to.include(record)
    })
  }

  public verifyNoMessage() {
    expect(this.messages).to.have.length(0)
  }

  /* private */

  private verifySourceMessage(loc: SourceLocation) {
    const start = <RecordSourceMessage>this.messages[0]
    expect(start.state).to.equal('record_start')
    expect(start.data.loc.scriptUrl).to.equal(loc.scriptUrl)
    expect(start.data.loc.lineNumber).to.equal(loc.lineNumber)

    const end = <RecordSourceMessage>this.messages.slice(-1)[0]
    expect(end.state).to.equal('record_end')
    expect(end.data.loc.scriptUrl).to.equal(loc.scriptUrl)
    expect(end.data.loc.lineNumber).to.equal(loc.lineNumber)
  }

  private messageHandler = (event: CustomEvent) => {
    // @NOTE: cannot concat array of objects
    this.messages = event.detail.messages
  }
}