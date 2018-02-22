import { expect } from 'chai'
import * as sinon from 'sinon'
import * as fs from 'fs'

import {
  ACTION_CONTEXT_START,
  ACTION_CONTEXT_END,
  ACTION_DATA
} from '../../src/tracker/public/MessageTypes'
import contentscript from '../../src/extension/contentscript'
import { actionsOfJS as actions } from '../actions'

describe('contentscript', () => {
  const helpers = {
    messageHandler: sinon.spy(),
    devtoolSelectionChangedHandler: sinon.spy(),
    injectScript: sinon.spy()
  }

  before(() => {
    contentscript(helpers)
  })

  describe('listen to record message', () => {
    const { messageHandler } = helpers
    const dispatch = (messages: ActionMessage[]) => {
      window.dispatchEvent(
        new CustomEvent('js-tracker', {
          detail: { messages }
        })
      )
    }
    it('should handle \'js-tracker\' CustomEvent and call helpers.messageHandler with event.detail.record', () => {
      const start: ActionContextMessage = {
        type: ACTION_CONTEXT_START,
        data: { loc: actions[0].info.loc }
      }
      const end: ActionContextMessage = {
        type: ACTION_CONTEXT_END,
        data: { loc: actions[0].info.loc }
      }
      const record: ActionDataMessage = {
        type: ACTION_DATA,
        data: {
          trackid: actions[0].info.trackid,
          type: actions[0].info.type
        }
      }
      dispatch([start, record, end])

      expect(messageHandler.calledThrice).to.be.true
      expect(
        messageHandler.getCall(0)
          .calledWith(start)
      ).to.be.true
      expect(
        messageHandler.getCall(1)
          .calledWith(record)
      ).to.be.true
      expect(
        messageHandler.getCall(2)
          .calledWith(end)
      ).to.be.true
    })
  })

  describe('listen on devtool selection changed', () => {
    const { devtoolSelectionChangedHandler } = helpers

    it('should set devtoolSelectionChangedHandler to onDevtoolSelectionChanged property on window', () => {
      expect(window.onDevtoolSelectionChanged).to.equal(devtoolSelectionChangedHandler)
    })
  })

  describe('inject tracker script', () => {
    const { injectScript } = helpers;

    (<any>fs).readFileSync = sinon.stub().returnsArg(0)

    it('should call helpers.injectScript once with document.documentElement and file content from dist/tracker.js', () => {
      expect(injectScript.calledOnce).to.be.true

      const args = injectScript.getCall(0).args

      expect(args[0]).to.equal(document.documentElement)
      expect(args[1].includes('dist/tracker.js')).to.be.true
    })
  })
})