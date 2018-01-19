import { expect } from 'chai'
import * as sinon from 'sinon'

import actions from '../actions'
import initDevtoolHelpers from '../../src/extension/devtoolHelpers'

describe('devtool helpers', () => {
  const sandbox = sinon.sandbox.create()
  // @NOTE: there are some problems with sinon-chrome, we fake our own devtools
  const devtools = {
    panels: { openResource: sandbox.spy() },
    inspectedWindow: { eval: sandbox.spy() }
  }

  beforeEach(() => {
    sandbox.reset()
  })

  function testOpenSource(openSource: (url: string, line: number) => void) {
    expect(openSource).to.be.a('function')

    openSource('script.js', 1)
    // @NOTE: there is 1 offset of line number between stacktrace and openResource
    expect(
      devtools.panels.openResource
        .calledWith('script.js', 0)
    ).to.be.true
  }

  describe('sidebarInitHandler', () => {
    const renderSidebar = sandbox.spy()
    const helpers = initDevtoolHelpers(<any>devtools, renderSidebar)
    const sidebarInitHandler = helpers.sidebarInitHandler
    const sidebarController = (<any>helpers).sidebarController
    // @NOTE: sidebar apis: https://developer.chrome.com/extensions/devtools_panels#type-ExtensionSidebarPane
    const sidebar = {
      setPage: sandbox.spy(),
      onShown: { addListener: sandbox.spy() },
      onHidden: { addListener: sandbox.spy() }
    }

    it('should call sidebar.setPage with \'dist/sidebar.html\'', () => {
      sidebarInitHandler(<any>sidebar)

      expect(sidebar.setPage.calledOnce).to.be.true

      const path = sidebar.setPage.getCall(0).args[0]

      expect(path.includes('dist/sidebar.html')).to.be.true
    })

    it('should call sidebar.onShown.addListener once with a function', () => {
      sidebarInitHandler(<any>sidebar)

      expect(sidebar.onShown.addListener.calledOnce).to.be.true
      expect(
        sidebar.onShown.addListener
          .getCall(0).args[0]
      ).to.be.a('function')
    })

    it('should call sidebar.onHidden.addListener once with a function', () => {
      sidebarInitHandler(<any>sidebar)

      expect(sidebar.onHidden.addListener.calledOnce).to.be.true
      expect(
        sidebar.onHidden.addListener
          .getCall(0).args[0]
      ).to.be.a('function')
    })

    describe('onShownHandler', () => {
      let onShownHandler

      before(() => {
        sidebarInitHandler(<any>sidebar)
        onShownHandler = sidebar.onShown.addListener.getCall(0).args[0]
      })

      afterEach(() => {
        sidebarController.records = []
        sidebarController.sidebarWindow = null
      })

      it('should render sidebar to main element in sidebar window shown (arg1) given no sidebar window is opened with an object (arg2) including pre-saved records, always false shouldTagDiffs flag, and openSource function', () => {
        const main: Element = document.createElement('main')
        const sidebarWindow = {
          document: {
            getElementsByTagName: sandbox.stub().withArgs('main').returns([main])
          }
        }
        sidebarController.records =
          actions.map((action) => action.record)
        sidebarController.sidebarWindow = null

        onShownHandler(<any>sidebarWindow)

        expect(renderSidebar.calledOnce).to.be.true
        expect(sidebarController.sidebarWindow).to.equal(sidebarWindow)

        const [
          container,
          { records, shouldTagDiffs, openSource }
        ] = renderSidebar.getCall(0).args

        expect(container).to.equal(main)
        expect(records).to.equal(sidebarController.records)
        expect(shouldTagDiffs).to.be.false
        testOpenSource(openSource)
      })

      it('should render sidebar to main element in opened sidebar window other than sidebar window shown (arg1) with an object (arg2) including pre-saved records, always false shouldTagDiffs flag, and openSource function', () => {
        const main1: Element = document.createElement('main')
        const main2: Element = document.createElement('main')
        const sidebarWindow1 = {
          document: {
            getElementsByTagName: sandbox.stub().withArgs('main').returns([main1])
          }
        }
        const sidebarWindow2 = {
          document: {
            getElementsByTagName: sandbox.stub().withArgs('main').returns([main2])
          }
        }
        sidebarController.records =
          actions.map((action) => action.record)
        sidebarController.sidebarWindow = sidebarWindow1

        onShownHandler(<any>sidebarWindow2)

        expect(renderSidebar.calledOnce).to.be.true
        expect(sidebarController.sidebarWindow).to.equal(sidebarWindow1)

        const [
          container,
          { records, shouldTagDiffs, openSource }
        ] = renderSidebar.getCall(0).args

        expect(container).to.equal(main1)
        expect(records).to.equal(sidebarController.records)
        expect(shouldTagDiffs).to.be.false
        testOpenSource(openSource)
      })
    })

    describe('onHiddenHandler', () => {
      let onHiddenHandler

      before(() => {
        sidebarInitHandler(<any>sidebar)
        onHiddenHandler = sidebar.onHidden.addListener.getCall(0).args[0]
      })

      afterEach(() => {
        sidebarController.sidebarWindow = null
      })

      it('should do nothing given no sidebar window opened', () => {
        sidebarController.sidebarWindow = null

        onHiddenHandler()

        expect(sidebarController.sidebarWindow).to.be.null
      })

      it('should close opened sidebar window', () => {
        sidebarController.sidebarWindow = {
          document: { getElementsByTagName: () => null }
        }
        onHiddenHandler()

        expect(sidebarController.sidebarWindow).to.be.null
      })
    })
  })

  describe('backgroundMessageHandler', () => {
    const renderSidebar = sandbox.spy()
    const helpers = initDevtoolHelpers(<any>devtools, renderSidebar)
    const backgroundMessageHandler = helpers.backgroundMessageHandler
    const sidebarController = (<any>helpers).sidebarController

    afterEach(() => {
      sidebarController.records = []
      sidebarController.sidebarWindow = null
    })

    it('should not render anything given sidebar window is not opened', () => {
      const message: Message = {
        records: actions.map((action) => action.record),
        selectionChanged: false
      }
      sidebarController.sidebarWindow = null

      backgroundMessageHandler(message)

      expect(renderSidebar.called).to.be.false
    })

    for (const selectionChanged of [false, true]) {
      it(`should render sidebar to main element in opened sidebar window based on given message (selectionChanged: ${selectionChanged})`, () => {
        const main: Element = document.createElement('main')
        const sidebarWindow = {
          document: {
            getElementsByTagName: sandbox.stub().withArgs('main').returns([main])
          }
        }
        sidebarController.sidebarWindow = sidebarWindow

        const message: Message = {
          records: actions.map((action) => action.record),
          selectionChanged
        }
        backgroundMessageHandler(message)

        expect(renderSidebar.calledOnce).to.be.true

        const [
          container,
          { records, shouldTagDiffs, openSource }
        ] = renderSidebar.getCall(0).args

        expect(container).to.equal(main)
        expect(records).to.equal(message.records)
        expect(shouldTagDiffs).to.equal(!message.selectionChanged)
        testOpenSource(openSource)
      })
    }
  })

  describe('selectionChangedHandler', () => {
    const { selectionChangedHandler } = initDevtoolHelpers(<any>devtools, null)

    it('should call devtools.inspectedWindow.eval with proper arguments', () => {
      selectionChangedHandler()

      expect(
        devtools.inspectedWindow.eval
          .calledWith('onDevtoolSelectionChanged($0)', { useContentScriptContext: true })
      ).to.be.true
    })
  })
})