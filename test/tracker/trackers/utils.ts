import { expect } from 'chai'
import * as StackTrace from 'stacktrace-js'

import OwnerManager from '../../../src/tracker/private/OwnerManager'
import {
  attachListenerTo,
  detachListenerFrom
} from '../../../src/tracker/private/NativeUtils'

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

  public verifyMessages(
    loc: SourceLocation,
    data: RecordData,
    messages: RecordMessage[] = this.messages
  ) {
    this.verifySourceMessage(loc, messages);

    [].concat(data).map((datum) => {
      const record = { state: 'record', data: datum }
      expect(messages).to.include(record)
    })
  }

  public verifyListOfMessages(list: Array<{ loc: SourceLocation, data: RecordData }>) {
    const chunks = this.sliceMessagesToChunks(this.messages)

    expect(
      chunks.length,
      'length of message chunks received is not equal to length of list with expected chunks'
    ).to.equal(list.length)

    chunks.map((chunk, index) => {
      const { loc, data } = list[index]
      this.verifyMessages(loc, data, chunk)
    })
  }

  public verifyNoMessage() {
    expect(this.messages).to.have.length(0)
  }

  /* private */

  private verifySourceMessage(
    loc: SourceLocation,
    messages: RecordMessage[]
  ) {
    const start = <RecordSourceMessage>messages[0]
    expect(start.state).to.equal('record_start')
    expect(start.data.loc.scriptUrl).to.equal(loc.scriptUrl)
    expect(start.data.loc.lineNumber).to.equal(loc.lineNumber)

    const end = <RecordSourceMessage>messages.slice(-1)[0]
    expect(end.state).to.equal('record_end')
    expect(end.data.loc.scriptUrl).to.equal(loc.scriptUrl)
    expect(end.data.loc.lineNumber).to.equal(loc.lineNumber)
  }

  private sliceMessagesToChunks(messages: RecordMessage[]) {
    const result = []

    let count = 0
    let head = -1

    for (let i = 0; i < this.messages.length; i++) {
      switch (this.messages[i].state) {
        case 'record_start':
          if (count === 0) {
            head = i
          }
          count += 1
          break

        case 'record_end':
          count -= 1
          if (count === 0) {
            result.push(this.messages.slice(head, i + 1))
          }
          break
      }
    }
    return result
  }

  private messageHandler = (event: CustomEvent) => {
    this.messages = this.messages.concat(event.detail.messages)
  }
}

export function getPrevLineSourceLocation(offset: number = 0): SourceLocation {
  const loc = StackTrace.getSync()[1]

  return {
    scriptUrl: loc.fileName,
    lineNumber: loc.lineNumber - 1 + offset,
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