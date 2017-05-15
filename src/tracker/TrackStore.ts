/// <reference path="TrackStore.d.ts" />

import TrackidManager from './TrackidManager'

const trackidManager = new TrackidManager()

export default class TrackStore implements ITrackStore {
  static generateID = function () {
    return trackidManager.generateID()
  }
  static resetID = function () {
    trackidManager.resetID()
  }
  static createTrackData = function (
    caller: TrackTarget,
    target: string,
    action: PropertyKey
  ): TrackData {
    return {
      trackid: getTrackid(caller),
      target,
      action
    }
  }
  private store: {
    [key: string]: Array<TrackStoreData>
  } = {};
  public register(trackData: TrackData) { }
  public retrieve(trackid: string) { }
}

function getTrackid(
  caller: TrackTarget
): string {
  const owner: HTMLElement =
    caller instanceof HTMLElement ? caller : caller._owner

  if (!owner.dataset.trackid) {
    owner.dataset.trackid = TrackStore.generateID()
  }
  return owner.dataset.trackid
}
