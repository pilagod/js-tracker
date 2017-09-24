import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionStore from '../../../src/tracker/public/ActionStore'
import ActionType from '../../../src/tracker/public/ActionType'

import actions from '../../actions'
import actionsInHTML from '../../actionsInHTML'

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

  // describe('register', () => {
  //   it('should add action record to ActionStore grouped by trackid', async () => {
  //     await actionStore.register('1', actions[0].record)
  //     await actionStore.register('2', actions[1].record)

  //     expect(actionStore.get('1')).to.deep.equal([actions[0].record])
  //     expect(actionStore.get('2')).to.deep.equal([actions[1].record])
  //   })

  //   it('should apply FILO on action records in trackid group in ActionStore', async () => {
  //     await actionStore.register('1', actions[0].record)
  //     await actionStore.register('1', actions[1].record)

  //     expect(actionStore.get('1')).to.deep.equal([actions[1].record, actions[0].record])
  //   })

  //   it('should not allow ActionStore to add duplicate (same source.loc) records to same trackid group', async () => {
  //     await actionStore.register('1', actions[0].record)
  //     await actionStore.register('1', actions[0].record)

  //     expect(actionStore.get('1')).to.deep.equal([actions[0].record])
  //   })

  //   it('should allow ActionStore to add duplicate (same source.loc) records to different trackid group', async () => {
  //     await actionStore.register('1', actions[0].record)
  //     await actionStore.register('2', actions[0].record)

  //     expect(actionStore.get('1')).to.deep.equal([actions[0].record])
  //     expect(actionStore.get('2')).to.deep.equal([actions[0].record])
  //   })

  //   it('should return true given record added successfully', async () => {
  //     const shouldSuccess =
  //       await actionStore.register('1', actions[0].record)

  //     expect(shouldSuccess).to.be.true
  //   })

  //   it('should return false given record added has already been in ActionStore', async () => {
  //     await actionStore.register('1', actions[0].record)

  //     const shouldFail =
  //       await actionStore.register('1', actions[0].record)

  //     expect(shouldFail).to.be.false
  //   })
  // })

  describe('registerFromActionInfo', () => {
    describe('correctness of parsing record info', () => {
      async function testParsingGiven(actions: Array<{ info: ActionInfo, record: ActionRecord }>) {
        return await Promise.all(actions.map(async (action, index) => {
          await actionStore.registerFromActionInfo(
            Object.assign({}, action.info, {
              trackid: index
            })
          )
          // console.log(action.record.source.code)
          // console.log(actionStore.get(`${index}`)[0].source.code)
          expect(actionStore.get(`${index}`)).to.deep.equal([action.record])
        }))
      }

      it('should parse info correctly given javascript source', async () => {
        return testParsingGiven(actions)
      })

      it('should parse info correctly given html source', async () => {
        return testParsingGiven(actionsInHTML)
      })
    })

    it('should apply FILO on action records transformed from info in trackid group in ActionStore', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)
      await actionStore.registerFromActionInfo(actions[1].info)

      expect(actionStore.get('1')).to.deep.equal([actions[1].record, actions[0].record])
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records (parsed from info) to same trackid group', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)
      await actionStore.registerFromActionInfo(actions[0].info)

      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records (parsed from info) to different trackid group', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)
      await actionStore.registerFromActionInfo(
        Object.assign({}, actions[0].info, { trackid: '2' })
      )
      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
      expect(actionStore.get('2')).to.deep.equal([actions[0].record])
    })

    it('should merge trackid group specified in action info \'merge\' field to the front of target group before adding new record', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)
      await actionStore.registerFromActionInfo(
        Object.assign({}, actions[1].info, { trackid: '2', merge: '1' })
      )
      expect(actionStore.get('1')).to.deep.equal([])
      expect(actionStore.get('2')).to.deep.equal([actions[1].record, actions[0].record])

      // should avoid duplication after merging
      await actionStore.registerFromActionInfo(
        Object.assign({}, actions[0].info, { trackid: '2' })
      )
      expect(actionStore.get('2')).to.deep.equal([actions[1].record, actions[0].record])

      // should allow adding original records to the merged trackid group
      await actionStore.registerFromActionInfo(actions[0].info)

      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
    })

    it('should return true given info added successfully', async () => {
      const shouldSuccess =
        await actionStore.registerFromActionInfo(actions[0].info)

      expect(shouldSuccess).to.be.true
    })

    it('should return false given record added has already been in ActionStore', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)

      const shouldFail =
        await actionStore.registerFromActionInfo(actions[0].info)

      expect(shouldFail).to.be.false
    })
  })
})