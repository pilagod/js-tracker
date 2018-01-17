import TrackIDFactory from '../../src/tracker/private/TrackIDFactory'

beforeEach(() => {
  (<any>TrackIDFactory).resetID()
})
