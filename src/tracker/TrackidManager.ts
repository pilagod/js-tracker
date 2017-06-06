/// <reference path='./TrackIDManager.d.ts' />

export default class TrackIDManager implements ITrackIDManager {
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
