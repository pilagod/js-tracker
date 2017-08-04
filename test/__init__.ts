import * as chai from 'chai'
import TrackIDManager from '../src/tracker/TrackIDManager'

const expect = chai.expect;

beforeEach(function () {
  (<any>TrackIDManager).resetID()
})

describe('__init__', function () {
  it('should pass this canary test', function () {
    expect(true).to.be.true
  })
})