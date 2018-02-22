import { expect } from 'chai'
import * as sinon from 'sinon'
import * as fs from 'fs'

import { RECORD_STORE_ADD } from '../../src/extension/public/RecordStoreActions'
import contentscript from '../../src/extension/contentscript'
import { actionsOfJS as actions } from '../actions'

describe('contentscript', () => {
  const helpers = {
    recordStoreAddMessageHandler: sinon.spy(),
    devtoolSelectionChangedHandler: sinon.spy(),
    injectScript: sinon.spy()
  }
  before(() => {
    contentscript(helpers)
  })

  describe('listen to RecordStoreAddMessage', () => {
    const { recordStoreAddMessageHandler } = helpers
    const dispatch = (message: RecordStoreAddMessage) => {
      window.dispatchEvent(
        new CustomEvent(RECORD_STORE_ADD, {
          detail: { message }
        })
      )
    }
    it('should handle RECORD_STORE_ADD CustomEvent and call helpers.recordStoreAddMessageHandler with event.detail.message', () => {
      const message = {
        loc: actions[0].info.loc,
        data: [
          Object.assign({}, actions[0].info, { loc: undefined })
        ]
      }
      dispatch(message)

      expect(recordStoreAddMessageHandler.calledOnce).to.be.true
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