class TrackIDFactory {
  private trackid

  constructor() {
    this.trackid = 0
  }

  /* private */

  private generateID() {
    return (++this.trackid).toString()
  }

  private resetID() {
    this.trackid = 0
  }
}
export default new TrackIDFactory()

