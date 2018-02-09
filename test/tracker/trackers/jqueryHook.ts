import { expect } from 'chai'
import * as sinon from 'sinon'

import trackJqueryApis from '../../../src/tracker/trackers/jquery'
import * as tracker from '../../../src/tracker/trackers/jquery/tracker'

describe('jquery hook', () => {
  const sandbox = sinon.sandbox.create()
  const context = <any>window

  let jQuery, trackerStub

  before(() => {
    trackerStub = sandbox.stub(tracker, 'default')
    trackJqueryApis()
  })

  after(() => {
    sandbox.restore()
  })

  beforeEach(() => {
    sandbox.reset()

    jQuery = function () { }
    jQuery.prototype.jquery = '1.0.0'
  })

  afterEach(() => {
    context.$ = undefined
    context.jQuery = undefined
  })

  it('should call jquery tracker with value set on window.jQuery', () => {
    expect(context.jQuery).to.be.undefined

    context.jQuery = jQuery
    expect(context.jQuery).to.equal(jQuery)

    expect(trackerStub.calledOnce).to.be.true
    expect(trackerStub.calledWith(jQuery)).to.be.true
  })

  it('should call jquery tracker with value set on window.$', () => {
    expect(context.$).to.be.undefined

    context.$ = jQuery
    expect(context.$).to.equal(jQuery)

    expect(trackerStub.calledOnce).to.be.true
    expect(trackerStub.calledWith(jQuery)).to.be.true
  })

  it('should only call jquery tracker once given window.jQuery and window.$ set the same jquery', () => {
    context.$ = jQuery
    context.jQuery = jQuery

    expect(trackerStub.calledOnce).to.be.true
    expect(trackerStub.calledWith(jQuery)).to.be.true
  })

  it('should not call jquery tracker on those not jQuery value', () => {
    context.jQuery = function () { }
    context.jQuery = {}
    context.jQuery = 'this is not a jquery'
    context.jQuery = undefined

    expect(trackerStub.called).to.be.false
  })
})