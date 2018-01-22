import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionStore from '../../../src/tracker/public/ActionStore'
import ActionType from '../../../src/tracker/public/ActionType'

import { actionsOfJS, actionsOfHTML } from '../../actions'

describe('ActionStore', () => {
  let actionStore: IActionStore

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

  describe('registerFromActionInfo', () => {
    describe('correctness of parsing record info', () => {
      async function testParsingGiven(actions: Array<{ info: ActionInfo, record: ActionRecord }>) {
        return await Promise.all(actions.map(async (action, index) => {
          await actionStore.registerFromActionInfo(
            Object.assign({}, action.info, {
              trackid: index
            })
          )
          // console.log(action.record.code)
          // console.log(actionStore.get(`${index}`)[0].code)
          expect(actionStore.get(`${index}`)).to.deep.equal([action.record])
        }))
      }

      it('should parse info correctly given javascript source', async () => {
        return testParsingGiven(actionsOfJS)
      })

      it('should parse info correctly given html source', async () => {
        return testParsingGiven(actionsOfHTML)
      })
    })

    it('should apply FILO on action records transformed from info in trackid group in ActionStore', async () => {
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)
      await actionStore.registerFromActionInfo(actionsOfJS[1].info)

      expect(actionStore.get('1')).to.deep.equal([actionsOfJS[1].record, actionsOfJS[0].record])
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records (parsed from info) to same trackid group', async () => {
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)

      expect(actionStore.get('1')).to.deep.equal([actionsOfJS[0].record])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records (parsed from info) to different trackid group', async () => {
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)
      await actionStore.registerFromActionInfo(
        Object.assign({}, actionsOfJS[0].info, { trackid: '2' })
      )
      expect(actionStore.get('1')).to.deep.equal([actionsOfJS[0].record])
      expect(actionStore.get('2')).to.deep.equal([actionsOfJS[0].record])
    })

    it('should merge trackid group specified in action info \'merge\' field to the front of target group before adding new record', async () => {
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)
      await actionStore.registerFromActionInfo(
        Object.assign({}, actionsOfJS[1].info, { trackid: '2', merge: '1' })
      )
      expect(actionStore.get('1')).to.deep.equal([])
      expect(actionStore.get('2')).to.deep.equal([actionsOfJS[1].record, actionsOfJS[0].record])

      // should avoid duplication after merging
      await actionStore.registerFromActionInfo(
        Object.assign({}, actionsOfJS[0].info, { trackid: '2' })
      )
      expect(actionStore.get('2')).to.deep.equal([actionsOfJS[1].record, actionsOfJS[0].record])

      // should allow adding original records to the merged trackid group
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)

      expect(actionStore.get('1')).to.deep.equal([actionsOfJS[0].record])
    })

    it('should return true given info added successfully', async () => {
      const shouldSuccess =
        await actionStore.registerFromActionInfo(actionsOfJS[0].info)

      expect(shouldSuccess).to.be.true
    })

    it('should return false given record added has already been in ActionStore', async () => {
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)

      const shouldFail =
        await actionStore.registerFromActionInfo(actionsOfJS[0].info)

      expect(shouldFail).to.be.false
    })
  })
})