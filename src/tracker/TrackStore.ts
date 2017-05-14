/// <reference path="TrackStore.d.ts" />

export default class TrackStore implements ITrackStore {
  private store: object = {};

  register(trackData: TrackData) { }
  retrieve(trackid: string) { }
}
