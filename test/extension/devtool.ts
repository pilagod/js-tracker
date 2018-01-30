import { expect } from 'chai'
import * as sinon from 'sinon'

import devtool from '../../src/extension/devtool'

describe('devtool', () => {
  const sandbox = sinon.sandbox.create()
  const background = {
    postMessage: sandbox.spy(),
    onMessage: { addListener: sandbox.spy() }
  }
  const chrome = {
    devtools: {
      inspectedWindow: { tabId: 104857241 },
      panels: {
        elements: {
          createSidebarPane: sandbox.spy(),
          onSelectionChanged: { addListener: sandbox.spy() }
        }
      }
    },
    runtime: {
      connect: sandbox.stub().returns(background)
    }
  }
  const helpers = {
    backgroundMessageHandler: sandbox.spy(),
    selectionChangedHandler: sandbox.spy(),
    sidebarInitHandler: sandbox.spy()
  }
  before(() => {
    // @TODO: pack function
    devtool(<any>chrome, helpers)
  })

  describe('setup connection to background', () => {
    it('should connect to background with inspectedWindow.tabId as its connection name', () => {
      expect(chrome.runtime.connect.calledOnce).to.be.true

      const info = chrome.runtime.connect.getCall(0).args[0]

      expect(info.name.includes(chrome.devtools.inspectedWindow.tabId.toString())).to.be.true
    })

    it('should send init message containing tabID to background after connect', () => {
      const initMessage = {
        type: 'init',
        tabID: chrome.devtools.inspectedWindow.tabId.toString()
      }
      expect(
        background.postMessage
          .calledWith(initMessage)
      ).to.be.true
      expect(
        background.postMessage
          .withArgs(initMessage)
          .calledImmediatelyAfter(chrome.runtime.connect)
      ).to.be.true
    })

    it('should listen and handle background message with helpers.backgroundMessageHandler', () => {
      expect(background.onMessage.addListener.calledOnce).to.be.true
      expect(
        background.onMessage.addListener
          .calledWith(helpers.backgroundMessageHandler)
      ).to.be.true
    })
  })

  describe('setup sidebar', () => {
    it('should create sidebar named \'JS-Tracker\' with helpers.sidebarInitHandler as its call back', () => {
      expect(chrome.devtools.panels.elements.createSidebarPane.calledOnce).to.be.true

      const [name, handler] = chrome.devtools.panels.elements.createSidebarPane.getCall(0).args

      expect(name).to.equal('JS-Tracker')
      expect(handler).to.equal(helpers.sidebarInitHandler)
    })
  })

  describe('listen to selection change in devtool', () => {
    it('should listen and handle selection change in devtool with helpers.selectionChangedHandler', () => {
      expect(chrome.devtools.panels.elements.onSelectionChanged.addListener.calledOnce).to.be.true
      expect(
        chrome.devtools.panels.elements.onSelectionChanged.addListener
          .calledWith(helpers.selectionChangedHandler)
      ).to.be.true
    })

    it('should init selection', () => {
      expect((<sinon.SinonSpy>helpers.selectionChangedHandler).calledOnce).to.be.true
    })
  })
})