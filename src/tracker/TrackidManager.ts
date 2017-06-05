/// <reference path='./TrackidManager.d.ts' />

class TrackidManager implements ITrackidManager {
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
