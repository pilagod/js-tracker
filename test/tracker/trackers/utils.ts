/// <reference path='../../../src/extension/public/types/RecordStoreMessages.d.ts'/>
/// <reference path='../../../src/tracker/public/types/SourceLocation.d.ts'/>
/// <reference path='../../../src/tracker/private/types/ActionData.d.ts'/>

import { expect } from 'chai'
import * as StackTrace from 'stacktrace-js'

// import MessageBroker from '../../../src/tracker/private/MessageBroker';
import { RecordStoreAction } from '../../../src/extension/public/RecordStoreActions'
import { match } from '../../../src/tracker/public/SourceLocation'
// import {
//   ACTION_CONTEXT_START,
//   ACTION_CONTEXT_END,
//   ACTION_DATA,
// } from '../../../src/tracker/public/MessageTypes'
import {
  attachListenerTo,
  detachListenerFrom
} from '../../../src/tracker/private/NativeUtils'

type CatcherExpected = {
  loc: SourceLocation,
  data: ActionData
}
export class RecordStoreMessageCatcher {

  private messages: RecordStoreMessage[] = []

  constructor(
    private sender: EventTarget,
    private action: RecordStoreAction
  ) { }

  public setup() {
    attachListenerTo(this.sender, this.action, this.messageHandler)
  }

  public teardown() {
    detachListenerFrom(this.sender, this.action, this.messageHandler)
  }

  public reset() {
    this.messages = []
  }

  public verifyMessagesContain(expected: CatcherExpected | Array<CatcherExpected>) {
    const expecteds = [].concat(expected)

    expecteds.forEach((expected: CatcherExpected) => {
      this.verifyRecordStoreMessage(expected.loc, expected.data)
    })
  }

  public verifyMessagesContainExactly(expected: CatcherExpected | Array<CatcherExpected>) {
    expect(
      this.messages,
      'messages catched should have same count of expected messages'
    ).to.have.length([].concat(expected).length)
    this.verifyMessagesContain(expected)
  }

  public verifyNoMessage() {
    expect(
      this.messages,
      `there is/are ${this.messages.length} message(s) catched`
    ).to.have.length(0)
  }

  /* private */

  private messageHandler = (event: CustomEvent) => {
    this.messages = this.messages.concat(event.detail.message)
  }

  private verifyRecordStoreMessage(loc: SourceLocation, data: ActionData) {
    const message = this.messages.find((message) => {
      return match(loc, message.loc)
    })
    expect(
      message,
      `has no message with exepceted location ${loc}`
    ).to.be.not.undefined
    expect(
      message.data,
      `message doesn\'t contain expected ActionData ${data}`
    ).to.include(data)
  }
}

export function createSourceLocationWith(
  lineOffset: number,
  columnNumber: number
): SourceLocation {
  const stackframe = StackTrace.getSync()[1]

  return {
    scriptUrl: stackframe.fileName,
    lineNumber: stackframe.lineNumber + lineOffset,
    columnNumber: columnNumber
  }
}

export function getActionContextFromPrevLine(offset: number = 0): { loc: SourceLocation } {
  const loc = StackTrace.getSync()[1]

  return {
    loc: {
      scriptUrl: loc.fileName,
      lineNumber: loc.lineNumber - 1 + offset,
      columnNumber: loc.columnNumber
    }
  }
}

export function createActionData(trackid: string, type: ActionType, merge?: string): ActionData {
  const record: ActionData = { trackid, type }

  if (merge) {
    record.merge = merge
  }
  return record
}
