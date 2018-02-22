import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionRecordStore from '../../../src/extension/private/ActionRecordStore'
import ActionType from '../../../src/tracker/public/ActionType'

import {
  actionsOfJS,
  actionsOfHTML,
  actionsOfMinHTML
} from '../../actions'

describe('ActionRecordStore', () => {
  let store: IActionRecordStore

  beforeEach(() => {
    store = new ActionRecordStore()
  })

  describe('get', () => {
    it('should return [] given non-exsiting trackid', () => {
      expect(store.get(undefined)).to.deep.equal([])
      expect(store.get(null)).to.deep.equal([])
      expect(store.get('-1')).to.deep.equal([])
      expect(store.get('')).to.deep.equal([])
    })
  })

  describe('registerFromActionInfo', () => {
    describe('correctness of parsing record info', () => {
      function register(infos: ActionInfo[]) {
        return Promise.all(
          infos.map((info) => store.registerFromActionInfo(info))
        )
      }
      it('should register action info correctly given javascript source', async () => {
        const infos = actionsOfJS.map((action) => action.info)
        const records = actionsOfJS.map((action) => action.record)

        return register(infos).then(() => {
          const results = store.get('1')

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
          const results = store.get('1')

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
          const results = store.get('1')

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
          const results = store.get('1')

          expect(results).to.have.length(1)
          expect(results).to.include(record)
        })
      })

      it('should register repeated action info at different time correctly', async () => {
        for (let i = 0; i < 3; i++) {
          await store.registerFromActionInfo(actionsOfJS[5].info)

          const results = store.get('1')

          expect(results).to.have.length(1)
          expect(results).to.include(actionsOfJS[5].record)
        }
      })
    })

    it('should apply FILO on action records transformed from info in trackid group in ActionRecordStore', async () => {
      await store.registerFromActionInfo(actionsOfJS[0].info)
      await store.registerFromActionInfo(actionsOfJS[1].info)

      expect(store.get('1')).to.deep.equal([actionsOfJS[1].record, actionsOfJS[0].record])
    })

    it('should not allow ActionRecordStore to add duplicate (same source.loc) records (registerd from info) to same trackid group', async () => {
      await store.registerFromActionInfo(actionsOfJS[0].info)
      await store.registerFromActionInfo(actionsOfJS[0].info)

      expect(store.get('1')).to.deep.equal([actionsOfJS[0].record])
    })

    it('should allow ActionRecordStore to add duplicate (same source.loc) records (registerd from info) to different trackid group', async () => {
      await store.registerFromActionInfo(actionsOfJS[0].info)
      await store.registerFromActionInfo(
        Object.assign({}, actionsOfJS[0].info, { trackid: '2' })
      )
      expect(store.get('1')).to.deep.equal([actionsOfJS[0].record])
      expect(store.get('2')).to.deep.equal([actionsOfJS[0].record])
    })

    it('should merge trackid group specified in action info \'merge\' field to the front of target group before adding new record', async () => {
      await store.registerFromActionInfo(actionsOfJS[0].info)
      await store.registerFromActionInfo(
        Object.assign({}, actionsOfJS[1].info, { trackid: '2', merge: '1' })
      )
      expect(store.get('1')).to.deep.equal([])
      expect(store.get('2')).to.deep.equal([actionsOfJS[1].record, actionsOfJS[0].record])

      // should avoid duplication after merging
      await store.registerFromActionInfo(
        Object.assign({}, actionsOfJS[0].info, { trackid: '2' })
      )
      expect(store.get('2')).to.deep.equal([actionsOfJS[1].record, actionsOfJS[0].record])

      // should allow adding original records to the merged trackid group
      await store.registerFromActionInfo(actionsOfJS[0].info)

      expect(store.get('1')).to.deep.equal([actionsOfJS[0].record])
    })

    it('should store two info with same loc but different type properly', async () => {
      return Promise.all([
        store.registerFromActionInfo(actionsOfJS[0].info),
        store.registerFromActionInfo(
          Object.assign({}, actionsOfJS[0].info, {
            trackid: '2',
            type: ActionType.Style
          })
        )
      ]).then(() => {
        expect(store.get('1')).to.deep.equal([actionsOfJS[0].record])
        expect(store.get('2')).to.deep.equal([Object.assign({}, actionsOfJS[0].record, { type: ActionType.Style })])
      })
    })

    it('should return true given info added successfully', async () => {
      const shouldSuccess =
        await store.registerFromActionInfo(actionsOfJS[0].info)

      expect(shouldSuccess).to.be.true
    })

    it('should return false given record added has already been in ActionRecordStore', async () => {
      await store.registerFromActionInfo(actionsOfJS[0].info)

      const shouldFail =
        await store.registerFromActionInfo(actionsOfJS[0].info)

      expect(shouldFail).to.be.false
    })
  })
})