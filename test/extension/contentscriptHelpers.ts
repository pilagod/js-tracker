import { expect } from 'chai'
import * as sinon from 'sinon'

import actions from '../actions'

import initContentscriptHelpers from '../../src/extension/contentscriptHelpers'

describe('contentscript helpers', () => {
  const sandbox = sinon.sandbox.create()
  const store = {
    get: sandbox.stub(),
    registerFromActionInfo: sandbox.stub(),
  }
  const updateSidebar = sandbox.stub()

  beforeEach(() => {
    sandbox.reset()
  })

  describe('actionHandler', () => {
    const helpers = initContentscriptHelpers(store, updateSidebar)
    const state = (<any>helpers).state
    // @NOTE: actionHandler is an async function
    const actionHandler = helpers.actionHandler

    beforeEach(() => {
      state.selection = null
    })

    it('should call store.registerFromActionInfo with given info', async () => {
      await actionHandler(actions[0].info)

      expect(
        store.registerFromActionInfo
          .calledWith(actions[0].info)
      ).to.be.true
    })

    it('should not call updateSidebar given store.registerFromActionInfo succeeds', async () => {
      store.registerFromActionInfo.returns(false)

      await actionHandler(actions[0].info)

      expect(updateSidebar.called).to.be.false
    })

    it('should not call updateSidebar given info\'s trackid is different from state.selection\'s trackid', async () => {
      state.selection = document.createElement('div')
      state.selection.setAttribute('trackid', '2')

      store.registerFromActionInfo.returns(true)

      await actionHandler(actions[0].info)

      expect(updateSidebar.called).to.be.false
    })

    it('should call updateSidebar with records got from store and false selectionChanged flag given store.registerFromActionInfo succeeds and info\'s trackid is same as state.selection\'s trackid', async () => {
      const response = { status: 'OK', description: 'done' }

      state.selection = document.createElement('div')
      state.selection.setAttribute('trackid', '1')

      store.get.withArgs('1').returns([actions[0].record])
      store.registerFromActionInfo.returns(true)

      updateSidebar.callsArgWith(1, response)
      const logSpy = sandbox.spy(console, 'log')

      await actionHandler(actions[0].info)

      expect(
        updateSidebar
          .calledWith(<Message>{
            records: [actions[0].record],
            selectionChanged: false
          })
      ).to.be.true
      expect(
        logSpy
          .calledWith('response:', response)
      ).to.be.true
    })
  })

  describe('devtoolSelectionChangedHandler', () => {
    const helpers = initContentscriptHelpers(store, updateSidebar)
    const state = (<any>helpers).state
    const devtoolSelectionChangedHandler = helpers.devtoolSelectionChangedHandler

    beforeEach(() => {
      state.selection = null
    })

    it('should call updateSidebar with empty records and true selectionChanged flag given state.selection is null', () => {
      store.get.withArgs(null).returns([])

      devtoolSelectionChangedHandler(null)

      expect(
        updateSidebar
          .calledWith(<Message>{
            records: [],
            selectionChanged: true
          })
      ).to.be.true
    })

    it('should call updateSidebar with empty records and true selectionChanged flag given state.selection has no trackid', () => {
      store.get.withArgs(null).returns([])

      devtoolSelectionChangedHandler(document.createElement('div'))

      expect(
        updateSidebar
          .calledWith(<Message>{
            records: [],
            selectionChanged: true
          })
      ).to.be.true
    })

    it('should update state.selection and call updateSidebar with records got from store and true selectionChanged flag given new state.selection has trackid', () => {
      store.get.withArgs('1').returns([actions[0].record])

      const div = document.createElement('div')
      div.setAttribute('trackid', '1')

      devtoolSelectionChangedHandler(div)

      expect(state.selection).to.equal(div)
      expect(
        updateSidebar
          .calledWith(<Message>{
            records: [actions[0].record],
            selectionChanged: true
          })
      ).to.be.true
    })
  })

  describe('injectScript helper', () => {
    const { injectScript } = initContentscriptHelpers(store, updateSidebar)

    it('should inject script element to container (arg1) with proper scriptText (arg2), then remove it', () => {
      const appendChild = sandbox.spy(document.documentElement, 'appendChild')
      const removeChild = sandbox.spy(document.documentElement, 'removeChild')
      const expectedScriptText = '/* this is expected script text */'

      injectScript(document.documentElement, expectedScriptText)

      expect(appendChild.calledOnce).to.be.true

      const appendedElement = appendChild.getCall(0).args[0]

      expect(appendedElement).to.be.an.instanceof(Element)
      expect(appendedElement.tagName.toLowerCase()).to.equal('script')
      expect(appendedElement.textContent).to.equals(expectedScriptText)

      expect(removeChild.calledOnce).to.be.true
      expect(removeChild.calledImmediatelyAfter(appendChild)).to.be.true

      const removedElement: Element = removeChild.getCall(0).args[0]

      expect(removedElement).to.equal(appendedElement)
    })
  })
})