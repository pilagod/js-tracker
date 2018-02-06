import { expect } from 'chai'
import * as sinon from 'sinon'

import trackJqueryApis from '../../../src/tracker/trackers/jquery'
import * as tracker from '../../../src/tracker/trackers/jquery/tracker'

describe('jquery hook', () => {
  const sandbox = sinon.sandbox.create()

  let trackerStub

  before(() => {
    trackerStub = sandbox.stub(tracker, 'default')
    trackJqueryApis()
  })

  after(() => {
    sandbox.restore()
  })

  beforeEach(() => {
    sandbox.reset()
  })

  it('should call default export of tracker with value set on window.jQuery', () => {
    const jQuery = {}

    expect(window['$']).to.be.undefined
    window['$'] = jQuery
    expect(window['$']).to.equal(jQuery)

    expect(window['jQuery']).to.be.undefined
    window['jQuery'] = jQuery
    expect(window['jQuery']).to.equal(jQuery)

    expect(trackerStub.calledOnce).to.be.true
    expect(trackerStub.calledWith(jQuery)).to.be.true
  })
})