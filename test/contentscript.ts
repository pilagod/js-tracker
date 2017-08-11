/// <reference path='../src/background.d.ts'/>

import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionStore from '../src/tracker/ActionStore'
import { Track_ID_Does_Not_Exist } from '../src/tracker/TrackIDManager'

import actions from './test-script-actions'

describe('contentscript', () => {
  describe('on message from tracker', () => {
    const inputFromTracker = (postMessage => info => postMessage(info, '*'))(window.postMessage);
    const registerFromActionInfo = ActionStore.prototype.registerFromActionInfo
    const registerFromActionInfoSpy = sinon.spy()

    before(() => {
      ActionStore.prototype.registerFromActionInfo = registerFromActionInfoSpy
    })

    after(() => {
      ActionStore.prototype.registerFromActionInfo = registerFromActionInfo
    })

    it('should call ActionStore.registerFromActionInfo with info collected from tracker', (done) => {
      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(
          registerFromActionInfoSpy
            .calledWith(actions[0].info)
        ).to.be.true
        done()
      }, 10)
    })
  })

  describe('on devtool selection changed', () => {
    const chrome = window.chrome
    const sandbox = sinon.sandbox.create()
    const outputToBackground = sandbox.spy()

    before(() => {
      (<any>window).chrome = {
        runtime: {
          sendMessage: outputToBackground
        }
      }
    })

    after(() => {
      (<any>window).chrome = chrome
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should set onDevtoolSelectionChanged on window', () => {
      expect(window.onDevtoolSelectionChanged).to.be.a('function')
    })

    it('should send proper message to background given a element that has already produced records', () => {
      const trackid = '1'

      sandbox.stub(ActionStore.prototype, 'get')
        .withArgs(trackid)
        .returns([actions[0].record])

      const div = document.createElement('div')

      sandbox.stub(div, 'getAttribute')
        .withArgs('trackid')
        .returns(trackid)

      window.onDevtoolSelectionChanged(div)

      expect(
        outputToBackground.calledWith(
          <Message>{
            trackid,
            records: [actions[0].record]
          }
        )
      ).to.be.true
    })
    // @NOTE: this case will happen when devtool first opened
    it('should send message with { trackid: Track_ID_Does_Not_Exist, records: [] } given undefined element', () => {
      window.onDevtoolSelectionChanged(undefined)

      expect(
        outputToBackground.calledWith(
          <Message>{
            trackid: Track_ID_Does_Not_Exist,
            records: []
          }
        )
      ).to.be.true
    })
  })
})