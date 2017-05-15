import * as chai from 'chai'
import TrackStore from '../src/tracker/TrackStore'

const expect = chai.expect;

beforeEach(function () {
  TrackStore.trackidManager.resetID()
  // (<any>window)._trackidManager.resetID()
})

describe('__init__', function () {
  it('should pass this canary test', function () {
    expect(true).to.be.true
  })
})