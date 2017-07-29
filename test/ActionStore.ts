import * as chai from 'chai'
import StackFrame from 'stackframe'
import ActionStore from '../src/tracker/ActionStore'
import ActionTypes from '../src/tracker/ActionTypes'

const PORT = 9876
const HOST = `http://localhost:${PORT}`
const expect = chai.expect

function createActionRecord(
  type: ActionTypes,
  scriptUrl: string,
  lineNumber: number,
  columnNumber: number,
  code: string,
): ActionRecord {
  return {
    key: `${scriptUrl}:${lineNumber}:${columnNumber}`,
    type: type,
    source: {
      loc: { scriptUrl, lineNumber, columnNumber },
      code: code
    }
  }
}

describe('ActionStore', () => {
  let actionStore: IActionStore

  beforeEach(() => {
    actionStore = new ActionStore()
  })

  describe('register', () => {
    const type = ActionTypes.None
    const scriptUrl = 'js-tracker.js'
    const lineNumber = 1
    const columnNumber = 1
    const code = 'console.log(\'Hello JS-Tracker\')'

    it('should add action record to ActionStore grouped by trackid', async () => {
      const records: ActionRecord[] = (function () {
        const result: ActionRecord[] = []

        for (let i = 0; i < 3; i++) {
          result.push(
            createActionRecord(type, scriptUrl, lineNumber + i, columnNumber, code + ` // ${i + 1}`)
          )
        }
        return result
      })()
      await actionStore.register('1', records[0])
      await actionStore.register('1', records[1])
      await actionStore.register('2', records[2])

      expect(actionStore.get('1')).to.deep.equal(records.slice(0, 2))
      expect(actionStore.get('2')).to.deep.equal(records.slice(2))
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records to same trackid group', async () => {
      const record: ActionRecord =
        createActionRecord(type, scriptUrl, lineNumber, columnNumber, code)

      await actionStore.register('1', record)
      await actionStore.register('1', record)

      expect(actionStore.get('1')).to.deep.equal([record])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records to different trackid group', async () => {
      const record: ActionRecord =
        createActionRecord(type, scriptUrl, lineNumber, columnNumber, code)

      await actionStore.register('1', record)
      await actionStore.register('2', record)

      expect(actionStore.get('1')).to.deep.equal([record])
      expect(actionStore.get('2')).to.deep.equal([record])
    })
  })

  describe('registerFromActionInfo', () => {
    const scriptUrl = HOST + '/base/test/test-script.js'
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
          fileName: scriptUrl,
          lineNumber: 2,
          columnNumber: 1
        })]
      }
      const record1: ActionRecord =
        createActionRecord(
          ActionTypes.Attribute,
          scriptUrl, 2, 1,
          `div.id = 'id'`
        )
      const info2: ActionInfo = {
        trackid: '1',
        target: 'CSSStyleDeclaration',
        action: 'color',
        stacktrace: [_, _, new StackFrame({
          functionName: 'Object.set',
          fileName: scriptUrl,
          lineNumber: 3,
          columnNumber: 1
        })]
      }
      const record2: ActionRecord =
        createActionRecord(
          ActionTypes.Style,
          scriptUrl, 3, 1,
          `div.style.color = 'red'`
        )
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
          fileName: scriptUrl,
          lineNumber: 4,
          columnNumber: 1
        })]
      }
      const record: ActionRecord =
        createActionRecord(
          ActionTypes.Style,
          scriptUrl, 4, 1,
          `div.removeAttribute('style')`
        )
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
          fileName: scriptUrl,
          lineNumber: 2,
          columnNumber: 1
        })]
      }
      const record: ActionRecord =
        createActionRecord(
          ActionTypes.Attribute,
          scriptUrl, 2, 1,
          `div.id = 'id'`
        )
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
          fileName: scriptUrl,
          lineNumber: 2,
          columnNumber: 1
        })]
      }
      const record: ActionRecord =
        createActionRecord(
          ActionTypes.Attribute,
          scriptUrl, 2, 1,
          `div.id = 'id'`
        )
      await actionStore.registerFromActionInfo(Object.assign({}, info, { trackid: '1' }))
      await actionStore.registerFromActionInfo(Object.assign({}, info, { trackid: '2' }))

      expect(actionStore.get('1')).to.deep.equal([record])
      expect(actionStore.get('2')).to.deep.equal([record])
    })

    it('should merge trackid group specified in action info \'merge\' to target before adding new record', async () => {
      const record1: ActionRecord =
        createActionRecord(
          ActionTypes.Attribute,
          scriptUrl, 2, 1,
          `div.id = 'id'`
        )
      const info2: ActionInfo = {
        trackid: '2',
        target: 'CSSStyleDeclaration',
        action: 'color',
        stacktrace: [_, _, new StackFrame({
          functionName: 'Object.set',
          fileName: scriptUrl,
          lineNumber: 3,
          columnNumber: 1
        })],
        merge: '1'
      }
      const record2: ActionRecord =
        createActionRecord(
          ActionTypes.Style,
          scriptUrl, 3, 1,
          `div.style.color = 'red'`
        )
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