interface ITrackStore {
  register(trackData: TrackData): void;
  retrieve(trackid: string): any;
}
type TrackData = {
}
