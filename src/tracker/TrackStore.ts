/// <reference path="TrackStore.d.ts" />

export default class TrackStore implements ITrackStore {
  /* public */

  public register(trackData: TrackData) { }
  public retrieve(trackid: string) { }

  /* private */

  private store: {
    [key: string]: Array<TrackRecord>
  } = {};
}

