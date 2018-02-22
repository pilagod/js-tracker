/// <reference path='../public/types/TrackID.d.ts'/>

class TrackIDFactory {
  private trackid = 0

  /* private */

  private generateID(): TrackID {
    return (++this.trackid).toString()
  }

  private resetID() {
    this.trackid = 0
  }
}
export default new TrackIDFactory()

