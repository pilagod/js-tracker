/// <reference path="TrackStore.d.ts" />

import TrackidManager from './TrackidManager'

export default class TrackStore implements ITrackStore {
  static trackidManager = new TrackidManager()
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
    owner.dataset.trackid =
      TrackStore.trackidManager.generateID()
  }
  return owner.dataset.trackid
}
