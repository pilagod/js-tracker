type TrackID = string

interface ITrackIDManager {
  isValid(trackid: string): boolean;
}