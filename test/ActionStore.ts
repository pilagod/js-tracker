import { expect } from 'chai'
import StackFrame from 'stackframe'
import ActionStore from '../src/tracker/ActionStore'
import ActionType from '../src/tracker/ActionType'

const PORT = 9876
const HOST = `http://localhost:${PORT}`

function createActionRecord(
  type: ActionType,
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
  const scriptUrl = HOST + '/base/test/test-script.js'

  let actionStore: IActionStore

  // all info and records refer to ./test-script.js
  let info1, info2, info3
  let record1, record2, record3

  before(() => {
    const _: StackTrace.StackFrame = new StackFrame({
      functionName: 'dummy',
      fileName: 'dummy.js',
      lineNumber: 0,
      columnNumber: 0
    })
    info1 = {
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
    info2 = {
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
    info3 = {
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
    record1 = createActionRecord(
      ActionType.Attr,
      scriptUrl, 2, 1,
      `div.id = 'id'`
    )
    record2 = createActionRecord(
      ActionType.Style,
      scriptUrl, 3, 1,
      `div.style.color = 'red'`
    )
    record3 = createActionRecord(
      ActionType.Style,
      scriptUrl, 4, 1,
      `div.removeAttribute('style')`
    )
  })

  beforeEach(() => {
    actionStore = new ActionStore()
  })

  describe('get', () => {
    it('should return [] given non-exsiting trackid', () => {
      expect(actionStore.get(undefined)).to.deep.equal([])
      expect(actionStore.get(null)).to.deep.equal([])
      expect(actionStore.get('-1')).to.deep.equal([])
      expect(actionStore.get('')).to.deep.equal([])
    })
  })

  describe('register', () => {
    it('should add action record to ActionStore grouped by trackid', async () => {
      await actionStore.register('1', record1)
      await actionStore.register('2', record2)

      expect(actionStore.get('1')).to.deep.equal([record1])
      expect(actionStore.get('2')).to.deep.equal([record2])
    })

    it('should apply FILO on action records in trackid group in ActionStore', async () => {
      await actionStore.register('1', record1)
      await actionStore.register('1', record2)

      expect(actionStore.get('1')).to.deep.equal([record2, record1])
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records to same trackid group', async () => {
      await actionStore.register('1', record1)
      await actionStore.register('1', record1)

      expect(actionStore.get('1')).to.deep.equal([record1])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records to different trackid group', async () => {
      await actionStore.register('1', record1)
      await actionStore.register('2', record1)

      expect(actionStore.get('1')).to.deep.equal([record1])
      expect(actionStore.get('2')).to.deep.equal([record1])
    })
  })

  describe('registerFromActionInfo', () => {

    // @NOTE: all info have trackid '1' by default

    it('should transform action info into record and add it to ActionStore', async () => {
      await actionStore.registerFromActionInfo(info1)

      expect(actionStore.get('1')).to.deep.equal([record1])
    })

    it('should transform action info into record and add it to ActionStore (actionTag scenario)', async () => {
      await actionStore.registerFromActionInfo(info3)

      expect(actionStore.get('1')).to.deep.equal([record3])
    })

    it('should apply FILO on action records transformed from info in trackid group in ActionStore', async () => {
      await actionStore.registerFromActionInfo(info1)
      await actionStore.registerFromActionInfo(info2)

      expect(actionStore.get('1')).to.deep.equal([record2, record1])
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records (parsed from info) to same trackid group', async () => {
      await actionStore.registerFromActionInfo(info1)
      await actionStore.registerFromActionInfo(info1)

      expect(actionStore.get('1')).to.deep.equal([record1])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records (parsed from info) to different trackid group', async () => {
      await actionStore.registerFromActionInfo(info1)
      await actionStore.registerFromActionInfo(
        Object.assign({}, info1, { trackid: '2' })
      )
      expect(actionStore.get('1')).to.deep.equal([record1])
      expect(actionStore.get('2')).to.deep.equal([record1])
    })

    it('should merge trackid group specified in action info \'merge\' field to the front of target group before adding new record', async () => {
      await actionStore.registerFromActionInfo(info1)
      await actionStore.registerFromActionInfo(
        Object.assign({}, info2, { trackid: '2', merge: '1' })
      )
      expect(actionStore.get('1')).to.deep.equal([])
      expect(actionStore.get('2')).to.deep.equal([record2, record1])

      // should avoid duplication after merging
      await actionStore.registerFromActionInfo(
        Object.assign({}, info1, { trackid: '2' })
      )
      expect(actionStore.get('2')).to.deep.equal([record2, record1])

      // should allow adding original records to the merged trackid group
      await actionStore.registerFromActionInfo(info1)

      expect(actionStore.get('1')).to.deep.equal([record1])
    })
  })
})