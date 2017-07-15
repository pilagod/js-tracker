import * as chai from 'chai'
import ActionStore from '../src/tracker/ActionStore'
import ActionTypes from '../src/tracker/ActionTypes'

const expect = chai.expect

describe('ActionStore', () => {
  let actionStore

  beforeEach(() => {
    actionStore = new ActionStore()
  })

  describe('register', () => {
    it('should add action record to ActionStore grouped by trackid', () => {
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
      actionStore.register('1', records[0])
      actionStore.register('1', records[1])
      actionStore.register('2', records[2])

      expect(actionStore.get('1')).to.deep.equal(records.slice(0, 2))
      expect(actionStore.get('2')).to.deep.equal(records.slice(2))
    })

    it('should not add duplicate (same source.loc) action record to same trackid group', () => {
      const record = {
        type: ActionTypes.None,
        source: {
          loc: 'js-tracker.js:1:1',
          code: `console.log('Hello JS-Tracker')`
        }
      }
      actionStore.register('1', record)
      actionStore.register('1', record)

      expect(actionStore.get('1')).to.deep.equal([record])
    })

    it('should allow adding duplicate (same source.loc) action record to different trackid group', () => {
      const record = {
        type: ActionTypes.None,
        source: {
          loc: 'js-tracker.js:1:1',
          code: `console.log('Hello JS-Tracker')`
        }
      }
      actionStore.register('1', record)
      actionStore.register('2', record)

      expect(actionStore.get('1')).to.deep.equal([record])
      expect(actionStore.get('2')).to.deep.equal([record])
    })
  })
})