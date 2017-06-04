/// <reference path="TrackStore.d.ts" />

import * as StackTrace from 'stacktrace-js'

import TrackidManager from './TrackidManager'

const trackidManager = new TrackidManager()

export default class TrackStore implements ITrackStore {

  /* static */

  static generateID = function () {
    return trackidManager.generateID()
  }
  static resetID = function () {
    trackidManager.resetID()
  }
  static createTrackData = function (
    info: {
      caller: TrackTarget,
      target: string,
      action: Action,
      merge?: string
    }
  ): TrackData {
    const trackData = {
      trackid: getTrackid(info.caller),
      target: info.target,
      action: info.action,
      stacktrace: StackTrace.getSync()
    }
    if (info.merge) {
      Object.assign(trackData, {
        merge: info.merge
      })
    }
    return trackData
  }

  /* private */

  private store: {
    [key: string]: Array<TrackStoreData>
  } = {};

  /* public */

  public register(trackData: TrackData) { }
  public retrieve(trackid: string) { }
}

function getTrackid(caller: TrackTarget): string {
  const owner: Owner = caller._owner

  if (!owner.dataset.trackid) {
    owner.dataset.trackid = TrackStore.generateID()
  }
  return owner.dataset.trackid
}
