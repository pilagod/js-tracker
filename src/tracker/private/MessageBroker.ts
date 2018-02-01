/// <reference path='../types/RecordMessage.d.ts'/>

import { TypeFilter } from './MessageFilters'
import { sendMessageToContentScript } from './NativeUtils'
import tracker from '../trackers/jquery/tracker';

export interface IMessageFilter {
  filter: (messages: RecordMessage[]) => void
}

export interface ISubscriber {
  flush: (messages: RecordMessage[]) => void
}

class MessageBroker {
  private messages: RecordMessage[] = []
  private wrapMessage: RecordWrapMessage = null
  private filters: IMessageFilter[] = []
  private subscribers: ISubscriber[] = []

  /* public */

  public isEmpty(): boolean {
    return this.messages.length === 0
  }

  public getWrapMessage(): RecordWrapMessage {
    return this.wrapMessage
  }

  public send(message: RecordMessage) {
    this.messages.push(message)
    // console.log('------ broker receive ------')
    // console.log(message.state, message.data)
    // console.log('----------------------------')
    switch (message.state) {
      case 'record_start':
        if (!this.wrapMessage) {
          this.wrapMessage = message
        }
        break

      case 'record':
        break

      case 'record_end':
        if (this.matchSource(this.wrapMessage.data.loc, message.data.loc)) {
          this.flush()
          this.wrapMessage = null
        }
        break
    }
  }

  public subscribe(subscriber: ISubscriber) {
    this.subscribers.push(subscriber)
  }

  public unsubscribe(subscriber: ISubscriber) {
    const index = this.subscribers.indexOf(subscriber)

    this.subscribers.splice(index, 1)
  }

  public addFilter(trackid: TrackID, type: ActionType) {
    const typeFilter = new TypeFilter(trackid, type)

    this.filters.push(typeFilter)
  }

  public removeFilter(trackid: TrackID, type: ActionType) {
    for (let i = this.filters.length; i--;) {
      const filter = <TypeFilter>this.filters[i]

      if (trackid === filter.filterID && !!(type & filter.filterType)) {
        this.filters.splice(i, 1)
      }
    }
  }

  /* private */

  private matchSource(loc1: SourceLocation, loc2: SourceLocation): boolean {
    return loc1.scriptUrl === loc2.scriptUrl
      && loc1.lineNumber === loc2.lineNumber
      && loc1.columnNumber === loc2.columnNumber
  }

  private flush() {
    const messages = this.messages

    this.messages = []
    this.filters.map((filter) => filter.filter(messages))

    if (!this.hasRecord(messages)) {
      return
    }
    // console.log('-------- flush --------')
    // messages.map((message) => {
    //   console.log(message.state, message.data)
    // })
    // console.log('-----------------------')
    this.subscribers.map((subscriber) => subscriber.flush(messages))
    messages.map((message) => {
      sendMessageToContentScript(message)
    })
  }

  private hasRecord(messages: RecordMessage[]) {
    return messages.filter((message) => message.state === 'record').length > 0
  }
}
const MessageBrokerSingleton = new MessageBroker()
// @NOTE: MessageBroker is a singleton
export default MessageBrokerSingleton