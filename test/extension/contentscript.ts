/// <reference path='../../src/extension/background.d.ts'/>

import { expect } from 'chai'
import * as sinon from 'sinon'
import * as fs from 'fs'

import { actionsOfJS as actions } from '../actions'
import contentscript from '../../src/extension/contentscript'

describe('contentscript', () => {
  const helpers = {
    actionHandler: sinon.spy(),
    devtoolSelectionChangedHandler: sinon.spy(),
    injectScript: sinon.spy()
  }
  before(() => {
    contentscript(helpers)
  })

  describe('listen on action', () => {
    const { actionHandler } = helpers

    it('should handle \'js-tracker\' CustomEvent and call helpers.actionHandler with event.detail.info', () => {
      window.dispatchEvent(
        new CustomEvent('js-tracker', {
          detail: {
            info: actions[0].info
          }
        })
      )
      expect(actionHandler.calledOnce).to.be.true
      expect(
        actionHandler
          .calledWith(actions[0].info)
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