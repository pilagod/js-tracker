/// <reference path='./TrackIDManager.d.ts'/>

class TrackIDManager implements ITrackIDManager {

  /* public */

  public generateID(): TrackID {
    return (++this.trackid).toString()
  }

  /* private */

  private trackid = 0

  private resetID() {
    this.trackid = 0
  }
}
// @NOTE: TrackIDManager should be a global singleton
// it will be used both in tracker and tests
export default (new TrackIDManager())
export const Null_TrackID = 'TRACK_ID_NOT_EXIST'

