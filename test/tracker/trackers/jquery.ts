import { expect } from 'chai'
import $ from 'jquery'

import ActionType from '../../../src/tracker/public/ActionType'
import trackJqueryApis from '../../../src/tracker/trackers/jquery/tracker'
import * as utils from './utils'

/* this test is based on dom tracker initialized in__init__.ts */

describe('jQuery API tracker', () => {
  const receiver = new utils.TrackerMessageReceiver(window)

  before(() => {
    trackJqueryApis($)
    receiver.setup()
  })

  after(() => {
    receiver.teardown()
  })

  beforeEach(() => {
    receiver.reset()
  })

  describe('Attr action type', () => {
    it('should track attr setter properly', () => {
      const div = document.createElement('div')

      $(div).attr('id', '1')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should not track attr getter', () => {
      const div = document.createElement('div')

      $(div).attr('id')
      const loc = utils.getPrevLineSourceLocation()

      receiver.verifyNoRecordMessageStream()
    })

    it('should track prop setter properly', () => {
      const div = document.createElement('div')

      $(div).prop('id', '1')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should not track prop getter', () => {
      const div = document.createElement('div')

      $(div).prop('id')
      const loc = utils.getPrevLineSourceLocation()

      receiver.verifyNoRecordMessageStream()
    })

    it('should track multiple targets of attr action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).prop('id', '1')
      const loc = utils.getPrevLineSourceLocation()

      // for div1
      const record1 = utils.createRecord('1', ActionType.Attr)
      const ownerID1 = utils.getOwnerOf(div1).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifyMessageStream(loc, record1)

      // for div2
      const record2 = utils.createRecord('2', ActionType.Attr)
      const ownerID2 = utils.getOwnerOf(div2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessageStream(loc, record2)
    })
  })

  describe('Behav action type', () => {
    it('should track click properly', () => {
      const div = document.createElement('div')

      $(div).click()
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Behav)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track multiple targets of behav action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).click()
      const loc = utils.getPrevLineSourceLocation()

      // for div1
      const record1 = utils.createRecord('1', ActionType.Behav)
      const ownerID1 = utils.getOwnerOf(div1).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifyMessageStream(loc, record1)

      // for div2
      const record2 = utils.createRecord('2', ActionType.Behav)
      const ownerID2 = utils.getOwnerOf(div2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessageStream(loc, record2)
    })
  })

  describe('Event action type', () => {
    it('should track ajax event properly', () => {
      const div = document.createElement('div')

      $(div).ajaxStart(() => { })
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Event)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track on (general event) properly', () => {
      const div = document.createElement('div')

      $(div).on('click', () => { })
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Event)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track click (explicit event) properly', () => {
      const div = document.createElement('div')

      $(div).click(() => { })
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Event)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track multiple targets of event action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).on('click', () => { })
      const loc = utils.getPrevLineSourceLocation()

      // for div1
      const record1 = utils.createRecord('1', ActionType.Event)
      const ownerID1 = utils.getOwnerOf(div1).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifyMessageStream(loc, record1)

      // for div2
      const record2 = utils.createRecord('2', ActionType.Event)
      const ownerID2 = utils.getOwnerOf(div2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessageStream(loc, record2)
    })
  })

  describe('Node action type', () => {
    it('should track after properly', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      const content = `<span>content</span>`

      parent.appendChild(child)
      receiver.reset()
      // @NOTE: this record will be saved on parent
      $(child).after(content)
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Node)
      const ownerID = utils.getOwnerOf(parent).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track append properly', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')

      $(parent).append(child)
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Node)
      const ownerID = utils.getOwnerOf(parent).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track multiple targets of node action properly', () => {
      const parent1 = document.createElement('div')
      const parent2 = document.createElement('div')
      const child = document.createElement('div')

      $(parent1).add(parent2).append(child)
      const loc = utils.getPrevLineSourceLocation()

      // for parent1
      const record1 = utils.createRecord('1', ActionType.Node)
      const ownerID1 = utils.getOwnerOf(parent1).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifyMessageStream(loc, record1)

      // for parent2
      const record2 = utils.createRecord('2', ActionType.Node)
      const ownerID2 = utils.getOwnerOf(parent2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessageStream(loc, record2)
    })
  })

  describe('Style action type', () => {
    it('should track addClass properly', () => {
      const div = document.createElement('div')

      $(div).addClass('class')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track css setter properly', () => {
      const div = document.createElement('div')

      $(div).css('background-color', 'red')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should not track css getter', () => {
      const div = document.createElement('div')
      // @NOTE: jQuery will do initial process on dom while getting the first call of css getter
      $(div).css('background-color')
      receiver.reset()

      $(div).css('background-color')
      const loc = utils.getPrevLineSourceLocation()

      receiver.verifyNoRecordMessageStream()
    })

    it('should track prop setter (class) properly', () => {
      const div = document.createElement('div')

      $(div).prop('class', 'class')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should not track prop getter (class)', () => {
      const div = document.createElement('div')

      $(div).prop('class')
      const loc = utils.getPrevLineSourceLocation()

      receiver.verifyNoRecordMessageStream()
    })

    it('should track prop setter (style) properly', () => {
      const div = document.createElement('div')

      $(div).prop('style', 'background-color: red')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should not track prop getter (style)', () => {
      const div = document.createElement('div')

      $(div).prop('style')
      const loc = utils.getPrevLineSourceLocation()

      receiver.verifyNoRecordMessageStream()
    })

    it('should track show properly', () => {
      const div = document.createElement('div')

      $(div).hide()
      receiver.reset()

      $(div).show()
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track hide properly', () => {
      const div = document.createElement('div')

      $(div).hide()
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track toggle properly', () => {
      const div = document.createElement('div')

      $(div).toggle()
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessageStream(loc, record)
    })

    it('should track multiple targets of style action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).addClass('class')
      const loc = utils.getPrevLineSourceLocation()

      // for div1
      const record1 = utils.createRecord('1', ActionType.Style)
      const ownerID1 = utils.getOwnerOf(div1).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifyMessageStream(loc, record1)

      // for div2
      const record2 = utils.createRecord('2', ActionType.Style)
      const ownerID2 = utils.getOwnerOf(div2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessageStream(loc, record2)
    })
  })
})