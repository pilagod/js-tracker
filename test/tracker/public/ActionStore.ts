import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionStore from '../../../src/tracker/public/ActionStore'
import ActionType from '../../../src/tracker/public/ActionType'

import {
  actionsOfJS,
  actionsOfHTML,
  actionsOfMinHTML
} from '../../actions'

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
      function register(infos: ActionInfo[]) {
        return Promise.all(
          infos.map((info) => actionStore.registerFromActionInfo(info))
        )
      }
      it('should register action info correctly given javascript source', async () => {
        const infos = actionsOfJS.map((action) => action.info)
        const records = actionsOfJS.map((action) => action.record)

        return register(infos).then(() => {
          const results = actionStore.get('1')

          expect(results).to.have.length(records.length)
          records.map((record) => {
            expect(results).to.include(record)
          })
        })
      })

      it('should register action info correctly given html source', async () => {
        const infos = actionsOfHTML.map((action) => action.info)
        const records = actionsOfHTML.map((action) => action.record)

        return register(infos).then(() => {
          const results = actionStore.get('1')

          expect(results).to.have.length(records.length)
          records.map((record) => {
            expect(results).to.include(record)
          })
        })
      })

      it('should register action info correctly given minified html source', async () => {
        const infos = actionsOfMinHTML.map((action) => action.info)
        const records = actionsOfMinHTML.map((action) => action.record)

        return register(infos).then(() => {
          const results = actionStore.get('1')

          expect(results).to.have.length(records.length)
          records.map((record) => {
            expect(results).to.include(record)
          })
        })
      })

      it('should register repeated action info at the same time correctly', () => {
        const infos = Array(3).fill(actionsOfJS[5].info)
        const record = actionsOfJS[5].record

        return register(infos).then(() => {
          const results = actionStore.get('1')

          expect(results).to.have.length(1)
          expect(results).to.include(record)
        })
      })

      it('should register repeated action info at different time correctly', async () => {
        for (let i = 0; i < 3; i++) {
          await actionStore.registerFromActionInfo(actionsOfJS[5].info)

          const results = actionStore.get('1')

          expect(results).to.have.length(1)
          expect(results).to.include(actionsOfJS[5].record)
        }
      })
    })

    it('should apply FILO on action records transformed from info in trackid group in ActionStore', async () => {
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)
      await actionStore.registerFromActionInfo(actionsOfJS[1].info)

      expect(actionStore.get('1')).to.deep.equal([actionsOfJS[1].record, actionsOfJS[0].record])
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records (registerd from info) to same trackid group', async () => {
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)
      await actionStore.registerFromActionInfo(actionsOfJS[0].info)

      expect(actionStore.get('1')).to.deep.equal([actionsOfJS[0].record])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records (registerd from info) to different trackid group', async () => {
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

    it('should store two info with same loc but different type properly', async () => {
      return Promise.all([
        actionStore.registerFromActionInfo(actionsOfJS[0].info),
        actionStore.registerFromActionInfo(
          Object.assign({}, actionsOfJS[0].info, {
            trackid: '2',
            type: ActionType.Style
          })
        )
      ]).then(() => {
        expect(actionStore.get('1')).to.deep.equal([actionsOfJS[0].record])
        expect(actionStore.get('2')).to.deep.equal([Object.assign({}, actionsOfJS[0].record, { type: ActionType.Style })])
      })
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