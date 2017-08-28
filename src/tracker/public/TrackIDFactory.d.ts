type TrackID = string

interface ITrackIDFactory {
  generateNullID(): TrackID;
}