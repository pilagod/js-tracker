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

  public verifyMessagesContain(expecteds: CatcherExpected | Array<CatcherExpected>) {
    [].concat(expecteds).map((expected: CatcherExpected) => {
      this.verifyRecordStoreMessage(expected.loc, expected.data)
    })
  }

  public verifyNoMessage() {
    expect(
      this.messages,
      `there is/are ${this.messages.length} message(s) catched`
    ).to.have.length(0)
  }
  public verifySingleMessageChunk(...args: any[]) { }
  public verifyMultipleMessageChunks(list: any) { }


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

// export class TrackerMessageReceiver {

//   private sender: EventTarget
//   private messages: ActionMessage[]

//   constructor(sender: EventTarget) {
//     this.messages = []
//     this.sender = sender
//   }

//   /* public */

//   public setup() {
//     attachListenerTo(this.sender, 'js-tracker', this.messageHandler)
//   }

//   public teardown() {
//     detachListenerFrom(this.sender, 'js-tracker', this.messageHandler)
//   }

//   public reset() {
//     this.messages = []
//   }

//   public verifySingleMessageChunk(
//     context: ActionContext,
//     data: ActionData,
//     messages: ActionMessage[] = this.messages
//   ) {
//     this.verifyContextMessage(context, messages);

//     expect(messages).to.include(
//       <ActionMessage>{ type: ACTION_DATA, data }
//     )
//   }

//   public verifyMultipleMessageChunks(list: Array<{ context: ActionContext, data: ActionData }>) {
//     const chunks = this.sliceMessagesToChunks(this.messages)

//     expect(
//       chunks.length,
//       'length of message chunks received is not equal to length of list with expected chunks'
//     ).to.equal(list.length)

//     chunks.map((chunk, index) => {
//       this.verifySingleMessageChunk(
//         list[index].context,
//         list[index].data,
//         chunk
//       )
//     })
//   }

//   public verifyNoMessage() {
//     expect(this.messages).to.have.length(0)
//   }

//   /* private */

//   private verifyContextMessage(
//     context: ActionContext,
//     messages: ActionMessage[]
//   ) {
//     const start = <ActionContextMessage>messages[0]
//     expect(start.type).to.equal(ACTION_CONTEXT_START)
//     expect(start.data.loc.scriptUrl).to.equal(context.loc.scriptUrl)
//     expect(start.data.loc.lineNumber).to.equal(context.loc.lineNumber)

//     const end = <ActionContextMessage>messages.slice(-1)[0]
//     expect(end.type).to.equal(ACTION_CONTEXT_END)
//     expect(end.data.loc.scriptUrl).to.equal(context.loc.scriptUrl)
//     expect(end.data.loc.lineNumber).to.equal(context.loc.lineNumber)
//   }

//   private sliceMessagesToChunks(messages: ActionMessage[]) {
//     const result = []

//     let count = 0
//     let head = -1

//     for (let i = 0; i < this.messages.length; i++) {
//       switch (this.messages[i].type) {
//         case ACTION_CONTEXT_START:
//           if (count === 0) {
//             head = i
//           }
//           count += 1
//           break

//         case ACTION_CONTEXT_END:
//           count -= 1
//           if (count === 0) {
//             result.push(this.messages.slice(head, i + 1))
//           }
//           break
//       }
//     }
//     return result
//   }

//   private messageHandler = (event: CustomEvent) => {
//     this.messages = this.messages.concat(event.detail.messages)
//   }
// }

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
