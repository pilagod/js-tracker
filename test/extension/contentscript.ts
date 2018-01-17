/// <reference path='../../src/extension/background.d.ts'/>

import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionStore from '../../src/tracker/public/ActionStore'
import actions from '../actions'

describe('contentscript', () => {
  const chrome = window.chrome
  const inputFromTracker = (info: ActionInfo) => {
    window.dispatchEvent(
      new CustomEvent('js-tracker', {
        detail: { info }
      })
    )
  }
  const sandbox = sinon.sandbox.create()
  const outputToBackground = sinon.stub().callsArgWith(1, 'response from background')

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

  beforeEach(() => {
    sandbox.restore()
    outputToBackground.resetHistory()
  })

  describe('on message from tracker', () => {
    const registerFromActionInfo = ActionStore.prototype.registerFromActionInfo
    const registerFromActionInfoStub = sinon.stub()
    const select = (element: Element) => {
      window.onDevtoolSelectionChanged(element)
      outputToBackground.resetHistory()
    }

    before(() => {
      ActionStore.prototype.registerFromActionInfo = registerFromActionInfoStub
    })

    after(() => {
      ActionStore.prototype.registerFromActionInfo = registerFromActionInfo
    })

    beforeEach(() => {
      select(null)
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

    it('should not send message given registering is failed', (done) => {
      registerFromActionInfoStub.returns(false)

      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(outputToBackground.called).to.be.false
        done()
      }, 10)
    })

    it('should not send message given updated target is not current selection', (done) => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.setAttribute('trackid', '1')
      div2.setAttribute('trackid', '2')

      select(div)

      registerFromActionInfoStub.returns(true)

      inputFromTracker(Object.assign({}, actions[0].info, { trackid: '2' }))

      setTimeout(() => {
        expect(outputToBackground.called).to.be.false
        done()
      }, 10)
    })

    it('should send message with new records and false selectionChanged to background given registering is successful and updated target is current selection', (done) => {
      const div = document.createElement('div')

      div.setAttribute('trackid', '1')

      select(div)

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
              records: [actions[0].record],
              selectionChanged: false
            }
          )
        ).to.be.true
        done()
      }, 10)
    })
  })

  describe('on devtool selection changed', () => {
    it('should set onDevtoolSelectionChanged on window', () => {
      expect(window.onDevtoolSelectionChanged).to.be.a('function')
    })

    it('should send message with empty records and true selectionChanged to background given element has no trackid', () => {
      const div = document.createElement('div')

      window.onDevtoolSelectionChanged(div)

      expect(
        outputToBackground.calledWith(
          <Message>{
            records: [],
            selectionChanged: true
          }
        )
      ).to.be.true
    })

    it('should send message with existed records and true selectionChanged to background given element has tradckid', () => {
      const div = document.createElement('div')

      div.setAttribute('trackid', '1')

      sandbox.stub(ActionStore.prototype, 'get')
        .withArgs('1')
        .returns([actions[0].record])

      window.onDevtoolSelectionChanged(div)

      expect(
        outputToBackground.calledWith(
          <Message>{
            records: [actions[0].record],
            selectionChanged: true
          }
        )
      ).to.be.true
    })
  })
})