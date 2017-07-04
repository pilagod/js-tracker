/// <reference path='./TrackIDManager.d.ts'/>

class TrackIDManager implements ITrackIDManager {
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
const _: ITrackIDManager = new TrackIDManager()

export default _
