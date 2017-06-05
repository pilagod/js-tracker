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
  static store = function (data: TrackData) {
    window.postMessage(createInfo(data), '*')
  }

  /* private */

  private store: {
    [key: string]: Array<TrackRecord>
  } = {};

  /* public */

  public register(trackData: TrackData) { }
  public retrieve(trackid: string) { }
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
    owner._trackid = TrackStore.generateID()
  }
  return owner._trackid
}
