/// <reference path='../../src/extension/public/types/RecordStoreMessages.d.ts'/>
/// <reference path='../../src/extension/private/types/DisplayMessages.d.ts'/>

import { expect } from 'chai'
import * as sinon from 'sinon'

import initContentscriptHelpers from '../../src/extension/contentscriptHelpers'
import { actionsOfJS as actions } from '../actions'

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

  describe('recordStoreAddMessageHandler', () => {
    const helpers = initContentscriptHelpers(store, updateSidebar)
    const recordStoreAddMessageHandler = helpers.recordStoreAddMessageHandler
    const createRecordStoreAddDataFromActionInfo = (info: ActionInfo) => {
      return {
        trackid: info.trackid,
        type: info.type
      }
    }
    describe('handle record message stream', () => {
      it('should call store.registerFromActionInfo with data of ActionDataMessage combining data of the start ActionContextMessage', async () => {
        const message = {
          loc: actions[0].info.loc,
          data: [
            createRecordStoreAddDataFromActionInfo(actions[0].info),
            createRecordStoreAddDataFromActionInfo(actions[1].info)
          ]
        }
        recordStoreAddMessageHandler(message)

        expect(store.registerFromActionInfo.calledTwice).to.be.true
        expect(
          store.registerFromActionInfo.getCall(0)
            .calledWith(actions[0].info)
        ).to.be.true
        expect(
          store.registerFromActionInfo.getCall(1)
            .calledWith(Object.assign({}, actions[1].info, { loc: actions[0].info.loc }))
        ).to.be.true
      })
    })

    describe('update sidebar', () => {
      const controller = (<any>helpers).contentscriptController
      const message = {
        loc: actions[0].info.loc,
        data: [
          createRecordStoreAddDataFromActionInfo(actions[0].info),
        ]
      }
      beforeEach(() => {
        controller.selection = document.createElement('div')
      })

      it('should not call updateSidebar given store.registerFromActionInfo fails', async () => {
        controller.selection.setAttribute('trackid', '1')
        store.registerFromActionInfo.returns(new Promise((resolve) => resolve(false)))

        await recordStoreAddMessageHandler(message)

        expect(updateSidebar.called).to.be.false
      })

      it('should not call updateSidebar given message.data\'s trackid is different from controller.selection\'s', async () => {
        controller.selection.setAttribute('trackid', '2')
        store.registerFromActionInfo.returns(new Promise((resolve) => resolve(true)))

        await recordStoreAddMessageHandler(message)

        expect(updateSidebar.called).to.be.false
      })

      it('should call updateSidebar with records got from store and false selectionChanged flag given both store.registerFromActionInfo succeeds and message.data\'s trackid is same as controller.selection\'s', async () => {
        controller.selection.setAttribute('trackid', '1')
        store.get.withArgs('1').returns([actions[0].record])
        store.registerFromActionInfo.returns(new Promise((resolve) => resolve(true)))

        await recordStoreAddMessageHandler(message)

        expect(updateSidebar.calledOnce).to.be.true
        expect(
          updateSidebar
            .calledWith(<DisplayMessage>{
              records: [actions[0].record],
              selectionChanged: false
            })
        ).to.be.true
      })
    })
  })

  describe('devtoolSelectionChangedHandler', () => {
    const helpers = initContentscriptHelpers(store, updateSidebar)
    const controller = (<any>helpers).contentscriptController
    const devtoolSelectionChangedHandler = helpers.devtoolSelectionChangedHandler

    beforeEach(() => {
      controller.selection = null
    })

    it('should call updateSidebar with empty records and true selectionChanged flag given state.selection is null', () => {
      store.get.withArgs(null).returns([])

      devtoolSelectionChangedHandler(null)

      expect(
        updateSidebar
          .calledWith(<DisplayMessage>{
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
          .calledWith(<DisplayMessage>{
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

      expect(controller.selection).to.equal(div)
      expect(
        updateSidebar
          .calledWith(<DisplayMessage>{
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