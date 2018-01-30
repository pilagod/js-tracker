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
      async function parse(index: number, info: ActionInfo) {
        await actionStore.registerFromActionInfo(
          Object.assign({}, info, { trackid: index })
        )
      }
      it('should parse action info correctly given javascript source', async () => {
        return Promise.all([
          parse(0, actionsOfJS[0].info),
          parse(1, actionsOfJS[1].info),
          parse(2, actionsOfJS[2].info),
          parse(3, actionsOfJS[3].info),
          parse(4, actionsOfJS[4].info),
        ]).then(() => {
          expect(actionStore.get('0')).to.deep.equal([actionsOfJS[0].record])
          expect(actionStore.get('1')).to.deep.equal([actionsOfJS[1].record])
          expect(actionStore.get('2')).to.deep.equal([actionsOfJS[2].record])
          expect(actionStore.get('3')).to.deep.equal([actionsOfJS[3].record])
          expect(actionStore.get('4')).to.deep.equal([actionsOfJS[4].record])
        })
      })

      it('should parse action info correctly given html source', async () => {
        return Promise.all([
          parse(0, actionsOfHTML[0].info),
          parse(1, actionsOfHTML[1].info),
          parse(2, actionsOfHTML[2].info),
        ]).then(() => {
          expect(actionStore.get('0')).to.deep.equal([actionsOfHTML[0].record])
          expect(actionStore.get('1')).to.deep.equal([actionsOfHTML[1].record])
          expect(actionStore.get('2')).to.deep.equal([actionsOfHTML[2].record])
        })
      })

      it('should parse repeated action info at the same time correctly', () => {
        return Promise.all((() => {
          const result = []
          for (let i = 0; i < 3; i++) {
            result.push(parse(5, actionsOfJS[5].info))
          }
          return result
        })()).then(() => {
          expect(actionStore.get('5')).to.deep.equal([actionsOfJS[5].record])
        })
      })

      it('should parse repeated action info at different time correctly', async () => {
        await parse(5, actionsOfJS[5].info)
        expect(actionStore.get('5')).to.deep.equal([actionsOfJS[5].record])

        await parse(5, actionsOfJS[5].info)
        expect(actionStore.get('5')).to.deep.equal([actionsOfJS[5].record])

        await parse(5, actionsOfJS[5].info)
        expect(actionStore.get('5')).to.deep.equal([actionsOfJS[5].record])
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