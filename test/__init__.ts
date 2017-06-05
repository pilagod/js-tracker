import * as chai from 'chai'
import TrackidManager from '../src/tracker/TrackidManager'

const expect = chai.expect;

beforeEach(function () {
  TrackidManager.resetID()
})

describe('__init__', function () {
  it('should pass this canary test', function () {
    expect(true).to.be.true
  })
})