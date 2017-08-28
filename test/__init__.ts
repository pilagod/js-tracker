import { expect } from 'chai'
import * as sinon from 'sinon'

import TrackIDFactory from '../src/tracker/public/TrackIDFactory'

beforeEach(function () {
  (<any>TrackIDFactory).resetID()
})

describe('__init__', function () {
  it('should pass this canary test', function () {
    expect(true).to.be.true
  })
})