type TrackID = string

interface ITrackIDManager {
  generateID(): TrackID;
}