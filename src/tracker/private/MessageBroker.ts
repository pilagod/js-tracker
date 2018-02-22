/// <reference path='../public/types/MessageTypes.d.ts'/>

import {
  ACTION_CONTEXT_START,
  ACTION_CONTEXT_END,
  ACTION_DATA,
} from '../public/MessageTypes'
import { match } from '../public/SourceLocation'
import { sendMessagesToContentScript } from './NativeUtils'

type SnapShot = {
  block: boolean;
  context: ActionContext;
  messages: ActionMessage[];
}

class MessageBroker {

  private snapshots: SnapShot[] = []

  private block: boolean = false
  private context: ActionContext = null
  private messages: ActionMessage[] = []

  /* public */

  public isEmpty(): boolean {
    return this.messages.length === 0
  }

  public isBlocking(): boolean {
    return this.block
  }

  public getContext(): ActionContext {
    return this.context
  }

  public startBlocking() {
    this.block = true
  }

  public stopBlocking() {
    this.block = false
  }

  public stackSnapshot() {
    this.snapshots.push(this.createSnapshot())
    this.use(this.createEmptySnapshot())
  }

  public restoreSnapshot() {
    this.use(this.snapshots.pop())
  }

  public send(message: ActionMessage) {
    if (this.block) {
      return
    }
    this.handleMessage(message)
  }

  /* private */

  private createSnapshot(): SnapShot {
    return {
      block: this.block,
      context: this.context,
      messages: this.messages.slice()
    }
  }

  private createEmptySnapshot(): SnapShot {
    return {
      block: false,
      context: null,
      messages: []
    }
  }

  private use(snapshot: SnapShot) {
    this.block = snapshot.block
    this.context = snapshot.context
    this.messages = snapshot.messages
  }

  private handleMessage(message: ActionMessage) {
    this.messages.push(message)

    switch (message.type) {
      case ACTION_CONTEXT_START:
        if (!this.context) {
          this.context = message.data
        }
        break

      case ACTION_CONTEXT_END:
        if (match(this.context.loc, message.data.loc)) {
          this.context = null
          this.flush()
        }
        break
    }
  }

  private flush() {
    const messages = this.flushMessages()

    if (!this.hasRecord(messages)) {
      return
    }
    sendMessagesToContentScript(messages)
  }

  private flushMessages(): ActionMessage[] {
    const messages = this.messages
    this.messages = []
    return messages
  }

  private hasRecord(messages: ActionMessage[]) {
    return messages.some((message) => message.type === ACTION_DATA)
  }
}
export default new MessageBroker()