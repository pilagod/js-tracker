/// <reference path='./TrackIDManager.d.ts' />

class TrackidManager implements ITrackIDManager {
  /* public */

  public resetID() {
    this.trackid = 0
  }
  public generateID(): string {
    return (++this.trackid).toString()
  }

  /* private */

  private trackid = 0
}
export default new TrackidManager()
