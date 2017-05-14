import * as chai from 'chai'

const expect = chai.expect

beforeEach(function () {
  (<any>window)._trackidManager.resetID()
})

describe('__init__', function () {
  it('should pass this canary test', function () {
    expect(true).to.be.true
  })
})