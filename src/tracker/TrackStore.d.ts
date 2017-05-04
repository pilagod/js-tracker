interface ITrackStore {
  register(track: Track): void;
  retrieve(trackId: string): any;
}
type Track = {
}
