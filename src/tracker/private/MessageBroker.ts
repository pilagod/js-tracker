/// <reference path='../types/RecordMessage.d.ts'/>

import { match } from '../public/SourceLocation'
import { sendMessagesToContentScript } from './NativeUtils'

class MessageBroker {

  private block: boolean = false
  private stack: RecordMessage[][] = []
  private source: RecordSource = null
  private messages: RecordMessage[] = []

  /* public */

  public isEmpty(): boolean {
    return this.messages.length === 0
  }

  public getCurrentSource(): RecordSource {
    return this.source
  }

  public isBlocking(): boolean {
    return this.block
  }

  public startBlocking() {
    this.block = true
  }

  public stopBlocking() {
    this.block = false
  }

  public stackMessages() {
    this.stack.push(this.clearMessages())
  }

  public restoreMessages() {
    this.messages = this.stack.pop()
    if (this.messages.length > 0) {
      this.source = (<RecordSourceMessage>this.messages[0]).data
    }
  }

  public send(message: RecordMessage) {
    if (this.block) {
      return
    }
    this.handleMessage(message)
  }

  /* private */

  private handleMessage(message: RecordMessage) {
    this.messages.push(message)

    switch (message.state) {
      case 'record_start':
        if (!this.source) {
          this.source = message.data
        }
        break

      case 'record_end':
        if (match(this.source.loc, message.data.loc)) {
          this.flush()
        }
        break
    }
  }

  private flush() {
    const messages = this.clearMessages()

    if (!this.hasRecord(messages)) {
      return
    }
    sendMessagesToContentScript(messages)
  }

  private clearMessages(): RecordMessage[] {
    const messages = this.messages

    this.messages = []
    this.source = null

    return messages
  }

  private hasRecord(messages: RecordMessage[]) {
    return messages.some((message) => message.state === 'record')
  }
}
export default new MessageBroker()