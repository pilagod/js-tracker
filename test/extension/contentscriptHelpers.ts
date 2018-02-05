import { expect } from 'chai'
import * as sinon from 'sinon'

import { actionsOfJS as actions } from '../actions'
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

  describe('messageHandler', () => {
    const helpers = initContentscriptHelpers(store, updateSidebar)
    const controller = (<any>helpers).contentscriptController
    const messageHandler = helpers.messageHandler // this is an async function

    const createRecordDataMessage = (data: RecordData) => (<RecordDataMessage>{ state: 'record', data })
    const createRecordSourceMessage = (loc: SourceLocation) => ({
      // @NOTE: to simulate the real environment, we copy loc to a new object
      start: <RecordSourceMessage>{ state: 'record_start', data: { loc: Object.assign({}, loc) } },
      end: <RecordSourceMessage>{ state: 'record_end', data: { loc: Object.assign({}, loc) } }
    })

    beforeEach(() => {
      controller.selection = null
    })

    describe('handle record message stream', () => {
      it('should not call store.registerFromActionInfo given RecordSourceMessage', async () => {
        const { start, end } = createRecordSourceMessage(actions[0].info.loc)

        await messageHandler(start)
        await messageHandler(end)

        expect(store.registerFromActionInfo.called).to.be.false
      })

      it('should call store.registerFromActionInfo with data of RecordDataMessage combining data of the start RecordSourceMessage', async () => {
        const { start, end } = createRecordSourceMessage(actions[0].info.loc)

        const record1 = createRecordDataMessage({
          trackid: actions[0].info.trackid,
          type: actions[0].info.type
        })
        const record2 = createRecordDataMessage({
          trackid: actions[1].info.trackid,
          type: actions[1].info.type
        })
        await messageHandler(start)
        await messageHandler(record1)
        await messageHandler(record2)
        await messageHandler(end)

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

      it('should ignore any RecordSourceMessage which is not the matched end RecordSourceMessage of the first start RecordSourceMessage', async () => {
        const { start: start1, end: end1 } = createRecordSourceMessage(actions[0].info.loc)
        const { start: start2, end: end2 } = createRecordSourceMessage(actions[1].info.loc)

        const { trackid, type } = actions[0].info
        const record = createRecordDataMessage({ trackid, type })

        await messageHandler(start1)
        await messageHandler(start2)
        await messageHandler(record)
        await messageHandler(end2)
        await messageHandler(end1)

        expect(store.registerFromActionInfo.calledOnce).to.be.true
        expect(
          store.registerFromActionInfo
            .calledWith(actions[0].info)
        ).to.be.true
      })

      it('should clear start RecordSourceMessage given the matched end RecordSourceMessage comes', async () => {
        const { start: start1, end: end1 } = createRecordSourceMessage(actions[0].info.loc)
        const { start: start2, end: end2 } = createRecordSourceMessage(actions[1].info.loc)

        const { trackid, type } = actions[0].info
        const record = createRecordDataMessage({ trackid, type })

        await messageHandler(start1)
        await messageHandler(end1)

        await messageHandler(start2)
        await messageHandler(record)
        await messageHandler(end2)

        expect(store.registerFromActionInfo.calledOnce).to.be.true
        expect(
          store.registerFromActionInfo
            .calledWith(Object.assign({}, actions[0].info, { loc: actions[1].info.loc }))
        ).to.be.true
      })
    })

    describe('update sidebar', () => {
      const { start, end } = createRecordSourceMessage(actions[0].info.loc)
      const { trackid, type } = actions[0].info
      const record = createRecordDataMessage({ trackid, type })

      beforeEach(async () => {
        await messageHandler(start)
      })

      afterEach(async () => {
        await messageHandler(end)
      })

      it('should not call updateSidebar given store.registerFromActionInfo fails', async () => {
        store.registerFromActionInfo.returns(new Promise((resolve) => resolve(false)))

        await messageHandler(record)

        expect(updateSidebar.called).to.be.false
      })

      it('should not call updateSidebar given store.registerFromActionInfo succeeds but info\'s trackid is different from controller.selection\'s trackid', async () => {
        const div = document.createElement('div')
        div.setAttribute('trackid', '2')

        controller.selection = div

        store.registerFromActionInfo.returns(new Promise((resolve) => resolve(false)))

        await messageHandler(record)

        expect(updateSidebar.called).to.be.false
      })

      it('should call updateSidebar with records got from store and false selectionChanged flag given store.registerFromActionInfo succeeds and info\'s trackid is same as controller.selection\'s trackid', async () => {
        const response = { status: 'OK', description: 'done' }

        const div = document.createElement('div')
        div.setAttribute('trackid', '1')

        controller.selection = div

        store.get.withArgs('1').returns([actions[0].record])
        store.registerFromActionInfo.returns(new Promise((resolve) => resolve(true)))

        const logSpy = sandbox.spy(console, 'log')
        updateSidebar.callsArgWith(1, response)

        await messageHandler(record)

        expect(updateSidebar.calledOnce).to.be.true
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

      expect(controller.selection).to.equal(div)
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