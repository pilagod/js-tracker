/// <reference path='../src/extension/background.d.ts'/>

import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionStore from '../src/tracker/public/ActionStore'
import TrackIDFactory from '../src/tracker/public/TrackIDFactory'
import { sendActionInfoToContentscript } from '../src/tracker/NativeUtils'
import MessageType from '../src/extension/MessageType'

import actions from './test-script-actions'

describe('contentscript', () => {
  const chrome = window.chrome
  const sandbox = sinon.sandbox.create()
  const inputFromTracker = sendActionInfoToContentscript
  const outputToBackground = sinon.spy()

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
    outputToBackground.reset()
  })

  describe('on message from tracker', () => {
    const registerFromActionInfo = ActionStore.prototype.registerFromActionInfo
    const registerFromActionInfoStub = sinon.stub()

    before(() => {
      ActionStore.prototype.registerFromActionInfo = registerFromActionInfoStub
    })

    after(() => {
      ActionStore.prototype.registerFromActionInfo = registerFromActionInfo
    })

    afterEach(() => {
      registerFromActionInfoStub.reset()
    })

    it('should call ActionStore.registerFromActionInfo with info collected from tracker', (done) => {
      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(
          registerFromActionInfoStub
            .calledWith(actions[0].info)
        ).to.be.true
        done()
      }, 10)
    })

    it('should send ActionStoreUpdated message with info.trackid and new records to background given registering successfully', (done) => {
      registerFromActionInfoStub.returns(true)

      sandbox.stub(ActionStore.prototype, 'get')
        .withArgs('1')
        .returns([actions[0].record])

      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(
          outputToBackground
            .calledAfter(registerFromActionInfoStub)
        ).to.be.true
        expect(
          outputToBackground.calledWith(
            <Message>{
              type: MessageType.ActionStoreUpdated,
              trackid: '1',
              records: [actions[0].record]
            })
        ).to.be.true
        done()
      }, 10)
    })

    it('should send DevtoolForceUpdate message with info.trackid and new records to background given selected element has no trackid before', (done) => {
      const div = document.createElement('div')

      window.onDevtoolSelectionChanged(div)

      registerFromActionInfoStub.returns(true)

      sandbox.stub(div, 'getAttribute')
        .withArgs('trackid')
        .returns('1')

      sandbox.stub(ActionStore.prototype, 'get')
        .withArgs('1')
        .returns([actions[0].record])

      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(
          outputToBackground
            .calledAfter(registerFromActionInfoStub)
        ).to.be.true
        expect(
          outputToBackground.calledWith(
            <Message>{
              type: MessageType.DevtoolForceUpdate,
              trackid: '1',
              records: [actions[0].record]
            })
        ).to.be.true
        done()
      }, 10)
    })

    it('should not send any message to background given registering unsuccessfully', (done) => {
      registerFromActionInfoStub.returns(false)

      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(
          outputToBackground.called
        ).to.be.false
        done()
      }, 10)
    })
  })

  describe('on devtool selection changed', () => {
    const type = MessageType.DevtoolSelectionChanged

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
            type,
            trackid,
            records: [actions[0].record]
          }
        )
      ).to.be.true
    })
    // @NOTE: this case will happen when devtool first opened
    it('should send message with { trackid: ${NullTrackID}, records: [] } given undefined element', () => {
      window.onDevtoolSelectionChanged(undefined)

      expect(
        outputToBackground.calledWith(
          <Message>{
            type,
            trackid: TrackIDFactory.generateNullID(),
            records: []
          }
        )
      ).to.be.true
    })

    it('should send message with { trackid: ${NullTrackID}, records: [] } given element has no trackid', () => {
      const div = document.createElement('div')

      sandbox.stub(div, 'getAttribute')
        .withArgs('trackid')
        .returns(null)

      window.onDevtoolSelectionChanged(div)

      expect(
        outputToBackground.calledWith(
          <Message>{
            type,
            trackid: TrackIDFactory.generateNullID(),
            records: []
          }
        )
      ).to.be.true
    })
  })
})