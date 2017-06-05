/// <reference path="TrackStore.d.ts" />

import * as StackTrace from 'stacktrace-js'
import TrackidManager from './TrackidManager'

export default class TrackStore implements ITrackStore {

  /* static */

  static store = function (data: TrackData) {
    window.postMessage(createInfo(data), '*')
  }

  /* public */

  public register(trackData: TrackData) { }
  public retrieve(trackid: string) { }

  /* private */

  private store: {
    [key: string]: Array<TrackRecord>
  } = {};
}

function createInfo(data: TrackData): TrackInfo {
  const info = {
    trackid: getTrackid(data.caller),
    target: data.target,
    action: data.action,
    stacktrace: StackTrace.getSync()
  }
  if (data.merge) {
    Object.assign(info, {
      merge: data.merge
    })
  }
  return info
}

function getTrackid(caller: TrackTarget): string {
  const owner = caller._owner

  if (!owner._trackid) {
    owner._trackid = TrackidManager.generateID()
  }
  return owner._trackid
}
