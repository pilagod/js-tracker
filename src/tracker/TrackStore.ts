/// <reference path="TrackStore.d.ts" />

export default class TrackStore implements ITrackStore {
  private store: object = {};

  register(track: Track) { }
  retrieve(trackId: string) { }
}
