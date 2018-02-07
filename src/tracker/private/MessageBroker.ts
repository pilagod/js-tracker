/// <reference path='../types/RecordMessage.d.ts'/>

import { sendMessagesToContentScript } from './NativeUtils'

class MessageBroker {

  private messageFilter = new MessageFilter()
  private messageSubscriber = new MessageSubscriber()

  private source: RecordSource = null
  private stack: (RecordMessage[])[] = []
  private messages: RecordMessage[] = []

  /* public */

  public isEmpty(): boolean {
    return this.messages.length === 0
  }

  public getCurrentSource(): RecordSource {
    return this.source
  }

  public stackMessages() {
    this.stack.push(this.clearMessages())
  }

  public restoreMessages() {
    this.messages = this.stack.pop()
    this.source = (<RecordSourceMessage>this.messages[0]).data
  }

  public subscribe(subscriber: ISubscriber) {
    this.messageSubscriber.add(subscriber)
  }

  public unsubscribe(subscriber: ISubscriber) {
    this.messageSubscriber.remove(subscriber)
  }

  public addFilter(trackid: TrackID, type: ActionType) {
    this.messageFilter.add(trackid, type)
  }

  public removeFilter(trackid: TrackID, type: ActionType) {
    this.messageFilter.remove(trackid, type)
  }

  public send(message: RecordMessage) {
    this.messages.push(message)

    switch (message.state) {
      case 'record_start':
        if (!this.source) {
          this.source = message.data
        }
        break

      case 'record_end':
        if (this.doesSourceMatch(message.data)) {
          this.source = null
          this.flush()
        }
        break
    }
  }

  /* private */

  private doesSourceMatch(source: RecordSource): boolean {
    const loc1 = this.source.loc
    const loc2 = source.loc

    return loc1.scriptUrl === loc2.scriptUrl
      && loc1.lineNumber === loc2.lineNumber
      && loc1.columnNumber === loc2.columnNumber
  }

  private flush() {
    const messages = this.clearMessages()

    this.messageFilter.filter(messages)

    if (!this.doesMessagesContainRecordData(messages)) {
      return
    }
    this.messageSubscriber.flush(messages)
    sendMessagesToContentScript(messages)
  }

  private clearMessages(): RecordMessage[] {
    const messages = this.messages

    this.messages = []
    this.source = null

    return messages
  }

  private doesMessagesContainRecordData(messages: RecordMessage[]) {
    return messages.filter((message) => message.state === 'record').length > 0
  }
}

class MessageFilter {

  private filters: {
    [trackid: string]: ActionType[]
  } = {}

  public add(trackid: string, type: ActionType) {
    if (!this.filters.hasOwnProperty(trackid)) {
      this.filters[trackid] = []
    }
    this.filters[trackid].push(type)
  }

  public remove(trackid: string, type: ActionType) {
    if (!this.filters[trackid]) {
      return
    }
    const index = this.filters[trackid].indexOf(type)

    if (index > - 1) {
      this.filters[trackid].splice(index, 1)
    }
  }

  public filter(messages: RecordMessage[]) {
    for (let i = messages.length; i--;) {
      const message = messages[i]

      if (message.state === 'record') {
        const { trackid, type } = message.data

        if (!!this.filters[trackid] && this.filters[trackid].indexOf(type) > -1) {
          messages.splice(i, 1)
        }
      }
    }
  }
}

export interface ISubscriber {
  flush: (messages: RecordMessage[]) => void
}

class MessageSubscriber {

  private subscribers: ISubscriber[] = []

  public add(subscriber: ISubscriber) {
    this.subscribers.push(subscriber)
  }

  public remove(subscriber: ISubscriber) {
    this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
  }

  public flush(messages: any) {
    this.subscribers.map((subscriber) => subscriber.flush(messages))
  }
}
// @NOTE: MessageBroker is a singleton
export default new MessageBroker()