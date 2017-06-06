import * as chai from 'chai'
import utils from '../src/tracker/utils'

const expect = chai.expect;

beforeEach(function () {
  utils.resetTrackID()
})

describe('__init__', function () {
  it('should pass this canary test', function () {
    expect(true).to.be.true
  })
})