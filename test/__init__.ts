import { expect } from 'chai'
import * as sinon from 'sinon'

import TrackIDManager from '../src/tracker/TrackIDManager'

beforeEach(function () {
  (<any>TrackIDManager).resetID()
})

describe('__init__', function () {
  it('should pass this canary test', function () {
    expect(true).to.be.true
  })
})