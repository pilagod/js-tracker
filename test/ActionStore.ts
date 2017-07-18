import * as chai from 'chai'
import StackFrame from 'stackframe'
import ActionStore from '../src/tracker/ActionStore'
import ActionTypes from '../src/tracker/ActionTypes'

const PORT = 9876
const HOST = `http://localhost:${PORT}`
const expect = chai.expect

describe('ActionStore', () => {
  let actionStore: IActionStore

  beforeEach(() => {
    actionStore = new ActionStore()
  })

  describe('register', () => {
    it('should add action record to ActionStore grouped by trackid', async () => {
      const records: ActionRecord[] = (function () {
        const results: ActionRecord[] = []

        for (let i = 0; i < 3; i++) {
          results.push({
            type: ActionTypes.None,
            source: {
              loc: `js-tracker.js:${i + 1}:1`,
              code: `console.log('this is line ${i + 1}');`
            }
          })
        }
        return results
      })()
      await actionStore.register('1', records[0])
      await actionStore.register('1', records[1])
      await actionStore.register('2', records[2])

      expect(actionStore.get('1')).to.deep.equal(records.slice(0, 2))
      expect(actionStore.get('2')).to.deep.equal(records.slice(2))
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records to same trackid group', async () => {
      const record: ActionRecord = {
        type: ActionTypes.None,
        source: {
          loc: 'js-tracker.js:1:1',
          code: `console.log('Hello JS-Tracker')`
        }
      }
      await actionStore.register('1', record)
      await actionStore.register('1', record)

      expect(actionStore.get('1')).to.deep.equal([record])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records to different trackid group', async () => {
      const record: ActionRecord = {
        type: ActionTypes.None,
        source: {
          loc: 'js-tracker.js:1:1',
          code: `console.log('Hello JS-Tracker')`
        }
      }
      await actionStore.register('1', record)
      await actionStore.register('2', record)

      expect(actionStore.get('1')).to.deep.equal([record])
      expect(actionStore.get('2')).to.deep.equal([record])
    })
  })

  describe('registerFromActionInfo', () => {
    // dummy stackframe 
    const _: StackTrace.StackFrame = new StackFrame({
      functionName: 'dummy',
      fileName: 'dummy.js',
      lineNumber: 0,
      columnNumber: 0
    })

    it('should transform action info into record and add it to ActionStore', async () => {
      const info1: ActionInfo = {
        trackid: '1',
        target: 'Element',
        action: 'id',
        stacktrace: [_, _, new StackFrame({
          functionName: 'Element.id',
          fileName: HOST + '/base/test/test-script.js',
          lineNumber: 2,
          columnNumber: 1
        })]
      }
      const record1: ActionRecord = {
        type: ActionTypes.Attribute,
        source: {
          loc: HOST + '/base/test/test-script.js:2:1',
          code: `div.id = 'id'`
        }
      }
      const info2: ActionInfo = {
        trackid: '1',
        target: 'CSSStyleDeclaration',
        action: 'color',
        stacktrace: [_, _, new StackFrame({
          functionName: 'Object.set',
          fileName: HOST + '/base/test/test-script.js',
          lineNumber: 3,
          columnNumber: 1
        })]
      }
      const record2: ActionRecord = {
        type: ActionTypes.Style,
        source: {
          loc: HOST + '/base/test/test-script.js:3:1',
          code: `div.style.color = 'red'`
        }
      }
      await actionStore.registerFromActionInfo(info1)
      await actionStore.registerFromActionInfo(info2)

      expect(actionStore.get('1')).to.deep.equal([record1, record2])
    })

    it('should transform action info into record and add it to ActionStore (actionTag scenario)', async () => {
      const info: ActionInfo = {
        trackid: '1',
        target: 'Element',
        action: 'removeAttribute',
        actionTag: 'style',
        stacktrace: [_, _, new StackFrame({
          functionName: 'Element.removeAttribute',
          fileName: HOST + '/base/test/test-script.js',
          lineNumber: 4,
          columnNumber: 1
        })]
      }
      const record: ActionRecord = {
        type: ActionTypes.Style,
        source: {
          loc: HOST + '/base/test/test-script.js:4:1',
          code: `div.removeAttribute('style')`
        }
      }
      await actionStore.registerFromActionInfo(info)

      expect(actionStore.get('1')).to.deep.equal([record])
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records (parsed from info) to same trackid group', async () => {
      const info: ActionInfo = {
        trackid: '1',
        target: 'Element',
        action: 'id',
        stacktrace: [_, _, new StackFrame({
          functionName: 'Element.id',
          fileName: HOST + '/base/test/test-script.js',
          lineNumber: 2,
          columnNumber: 1
        })]
      }
      const record: ActionRecord = {
        type: ActionTypes.Attribute,
        source: {
          loc: HOST + '/base/test/test-script.js:2:1',
          code: `div.id = 'id'`
        }
      }
      await actionStore.registerFromActionInfo(info)
      await actionStore.registerFromActionInfo(info)

      expect(actionStore.get('1')).to.deep.equal([record])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records (parsed from info) to different trackid group', async () => {
      const info: ActionInfo = {
        trackid: '',
        target: 'Element',
        action: 'id',
        stacktrace: [_, _, new StackFrame({
          functionName: 'Element.id',
          fileName: HOST + '/base/test/test-script.js',
          lineNumber: 2,
          columnNumber: 1
        })]
      }
      const record: ActionRecord = {
        type: ActionTypes.Attribute,
        source: {
          loc: HOST + '/base/test/test-script.js:2:1',
          code: `div.id = 'id'`
        }
      }
      await actionStore.registerFromActionInfo(Object.assign({}, info, { trackid: '1' }))
      await actionStore.registerFromActionInfo(Object.assign({}, info, { trackid: '2' }))

      expect(actionStore.get('1')).to.deep.equal([record])
      expect(actionStore.get('2')).to.deep.equal([record])
    })

    it('should merge trackid group specified in action info \'merge\' to target before adding new record', async () => {
      const record1: ActionRecord = {
        type: ActionTypes.Attribute,
        source: {
          loc: HOST + '/base/test/test-script.js:2:1',
          code: `div.id = 'id'`
        }
      }
      const info2: ActionInfo = {
        trackid: '2',
        target: 'CSSStyleDeclaration',
        action: 'color',
        stacktrace: [_, _, new StackFrame({
          functionName: 'Object.set',
          fileName: HOST + '/base/test/test-script.js',
          lineNumber: 3,
          columnNumber: 1
        })],
        merge: '1'
      }
      const record2: ActionRecord = {
        type: ActionTypes.Style,
        source: {
          loc: HOST + '/base/test/test-script.js:3:1',
          code: `div.style.color = 'red'`
        }
      }
      await actionStore.register('1', record1)
      await actionStore.registerFromActionInfo(info2)

      expect(actionStore.get('1')).to.be.undefined
      expect(actionStore.get('2')).to.deep.equal([record1, record2])

      // should avoid duplication after merging
      await actionStore.register('2', record1)

      expect(actionStore.get('2')).to.deep.equal([record1, record2])

      // should allow adding original records to the merged trackid group
      await actionStore.register('1', record1)

      expect(actionStore.get('1')).to.deep.equal([record1])
    })
  })
})