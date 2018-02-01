/// <reference path='../types/RecordMessage.d.ts'/>

import { IMessageFilter } from './MessageBroker'

export class TypeFilter implements IMessageFilter {
  public filterID: TrackID
  public filterType: ActionType

  constructor(filterID: TrackID, filterType: ActionType) {
    this.filterID = filterID
    this.filterType = filterType
  }

  public filter(messages: RecordMessage[]) {
    for (let i = messages.length; --i;) {
      if (this.shouldFilter(messages[i])) {
        messages.splice(i, 1)
      }
    }
  }

  private shouldFilter(message: RecordMessage): boolean {
    return message.state === 'record'
      && message.data.trackid === this.filterID
      && !!(message.data.type & this.filterType)
  }
}