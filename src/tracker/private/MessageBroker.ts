/// <reference path='../types/RecordMessage.d.ts'/>

import { match } from '../public/SourceLocation'
import { sendMessagesToContentScript } from './NativeUtils'

type SnapShot = {
  block: boolean;
  source: RecordSource;
  messages: RecordMessage[];
}

class MessageBroker {

  private snapshots: SnapShot[] = []

  private block: boolean = false
  private source: RecordSource = null
  private messages: RecordMessage[] = []

  /* public */

  public isEmpty(): boolean {
    return this.messages.length === 0
  }

  public isBlocking(): boolean {
    return this.block
  }

  public getSource(): RecordSource {
    return this.source
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

  public send(message: RecordMessage) {
    if (this.block) {
      return
    }
    this.handleMessage(message)
  }

  /* private */

  private createSnapshot(): SnapShot {
    return {
      block: this.block,
      source: this.source,
      messages: this.messages.slice()
    }
  }

  private createEmptySnapshot(): SnapShot {
    return {
      block: false,
      source: null,
      messages: []
    }
  }

  private use(snapshot: SnapShot) {
    this.block = snapshot.block
    this.source = snapshot.source
    this.messages = snapshot.messages
  }

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
          this.source = null
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

  private flushMessages(): RecordMessage[] {
    const messages = this.messages
    this.messages = []
    return messages
  }

  private hasRecord(messages: RecordMessage[]) {
    return messages.some((message) => message.state === 'record')
  }
}
export default new MessageBroker()