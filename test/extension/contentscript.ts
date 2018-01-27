/// <reference path='../../src/extension/background.d.ts'/>

import { expect } from 'chai'
import * as sinon from 'sinon'
import * as fs from 'fs'

import { actionsOfJS as actions } from '../actions'
import contentscript from '../../src/extension/contentscript'

describe('contentscript', () => {
  const helpers = {
    recordHandler: sinon.spy(),
    devtoolSelectionChangedHandler: sinon.spy(),
    injectScript: sinon.spy()
  }
  before(() => {
    contentscript(helpers)
  })

  describe('listen on action', () => {
    const { recordHandler } = helpers
    const dispatch = (message: RecordMessage) => {
      window.dispatchEvent(
        new CustomEvent('js-tracker', {
          detail: { message }
        })
      )
    }
    it('should handle \'js-tracker\' CustomEvent and call helpers.recordHandler with event.detail.record', () => {
      const start: RecordWrapMessage = { state: 'record_start', data: { loc: actions[0].info.loc } }
      const end: RecordWrapMessage = { state: 'record_end', data: { loc: actions[0].info.loc } }
      const record: RecordDataMessage = {
        state: 'record',
        data: {
          trackid: actions[0].info.trackid,
          type: actions[0].info.type
        }
      }
      dispatch(start)
      dispatch(record)
      dispatch(end)

      expect(recordHandler.calledThrice).to.be.true
      expect(
        recordHandler.getCall(0)
          .calledWith(start)
      ).to.be.true
      expect(
        recordHandler.getCall(1)
          .calledWith(record)
      ).to.be.true
      expect(
        recordHandler.getCall(2)
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