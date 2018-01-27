import trackDomApis from '../../../src/tracker/trackers/dom/tracker'
import TrackIDFactory from '../../../src/tracker/private/TrackIDFactory'

before(() => {
  trackDomApis()
})

beforeEach(() => {
  (<any>TrackIDFactory).resetID()
})
