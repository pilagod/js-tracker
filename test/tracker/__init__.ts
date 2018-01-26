import trackHtmlDomApi from '../../src/tracker/htmlDomApis'
import TrackIDFactory from '../../src/tracker/private/TrackIDFactory'

before(() => {
  trackHtmlDomApi()
})

beforeEach(() => {
  (<any>TrackIDFactory).resetID()
})
