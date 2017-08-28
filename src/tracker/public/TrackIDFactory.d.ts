type TrackID = string

interface ITrackIDFactory {
  generateID(): TrackID;
  generateNullID(): TrackID;
}