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
      receiver.verifyMessages(loc, record)
    })

    it('should not track attr getter', () => {
      const div = document.createElement('div')

      $(div).attr('id')

      receiver.verifyNoMessage()
    })

    it('should track prop setter properly', () => {
      const div = document.createElement('div')

      $(div).prop('id', '1')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Attr)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should not track prop getter', () => {
      const div = document.createElement('div')

      $(div).prop('id')

      receiver.verifyNoMessage()
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
      receiver.verifyMessages(loc, record1)

      // for div2
      const record2 = utils.createRecord('2', ActionType.Attr)
      const ownerID2 = utils.getOwnerOf(div2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessages(loc, record2)
    })
  })

  describe('Behav action type', () => {
    it('should have no error when no matched element', () => {
      $(null).click()
      expect(true).to.be.true
    })

    it('should track click properly (native event listener)', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.getPrevLineSourceLocation(-1)
      const record1 = utils.createRecord('1', ActionType.Style)

      receiver.reset()

      $(div).click()
      const loc2 = utils.getPrevLineSourceLocation()
      const record2 = utils.createRecord('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = utils.getOwnerOf(div.style).getTrackID()
      const ownerID2 = utils.getOwnerOf(div).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyListOfMessages([
        { loc: loc1, data: record1 },
        { loc: loc2, data: record2 },
      ])
    })

    it('should track click properly (jquery event listener)', () => {
      const div = document.createElement('div')

      $(div).on('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.getPrevLineSourceLocation(-1)
      const record1 = utils.createRecord('1', ActionType.Style)

      receiver.reset()

      $(div).click()
      const loc2 = utils.getPrevLineSourceLocation()
      const record2 = utils.createRecord('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = utils.getOwnerOf(div.style).getTrackID()
      const ownerID2 = utils.getOwnerOf(div).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyListOfMessages([
        { loc: loc1, data: record1 },
        { loc: loc2, data: record2 },
      ])
    })

    it('should track mouseenter (and those have no native trigger method like click()) and actions triggered by it properly', () => {
      const div = document.createElement('div')

      $(div).on('mouseenter', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.getPrevLineSourceLocation(-1)
      const record1 = utils.createRecord('1', ActionType.Style)

      receiver.reset()

      $(div).mouseenter()
      const loc2 = utils.getPrevLineSourceLocation()
      const record2 = utils.createRecord('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = utils.getOwnerOf(div.style).getTrackID()
      const ownerID2 = utils.getOwnerOf(div).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyListOfMessages([
        { loc: loc1, data: record1 },
        { loc: loc2, data: record2 },
      ])
    })

    it('should track trigger and actions triggered by it properly (add native event listener)', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.getPrevLineSourceLocation(-1)
      const record1 = utils.createRecord('1', ActionType.Style)

      receiver.reset()

      $(div).trigger('click')
      const loc2 = utils.getPrevLineSourceLocation()
      const record2 = utils.createRecord('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = utils.getOwnerOf(div.style).getTrackID()
      const ownerID2 = utils.getOwnerOf(div).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)

      receiver.verifyListOfMessages([
        { loc: loc1, data: record1 },
        { loc: loc2, data: record2 }
      ])
    })

    it('should track triggerHandler and actions triggered by it properly', () => {
      const div = document.createElement('div')
      // @NOTE: triggerHandler only trigger event registered by jquery 
      $(div).on('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.getPrevLineSourceLocation(-1)
      const record1 = utils.createRecord('1', ActionType.Style)

      receiver.reset()

      $(div).triggerHandler('click')
      const loc2 = utils.getPrevLineSourceLocation()
      const record2 = utils.createRecord('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = utils.getOwnerOf(div.style).getTrackID()
      const ownerID2 = utils.getOwnerOf(div).getTrackID()

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)

      receiver.verifyListOfMessages([
        { loc: loc1, data: record1 },
        { loc: loc2, data: record2 }
      ])
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
      receiver.verifyMessages(loc, record)
    })

    it('should track on (general event) properly', () => {
      const div = document.createElement('div')

      $(div).on('click', () => { })
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Event)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track click (explicit event) properly', () => {
      const div = document.createElement('div')

      $(div).click(() => { })
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Event)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
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
      receiver.verifyMessages(loc, record1)

      // for div2
      const record2 = utils.createRecord('2', ActionType.Event)
      const ownerID2 = utils.getOwnerOf(div2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessages(loc, record2)
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
      receiver.verifyMessages(loc, record)
    })

    it('should track append properly', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')

      $(parent).append(child)
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Node)
      const ownerID = utils.getOwnerOf(parent).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
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
      receiver.verifyMessages(loc, record1)

      // for parent2
      const record2 = utils.createRecord('2', ActionType.Node)
      const ownerID2 = utils.getOwnerOf(parent2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessages(loc, record2)
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
      receiver.verifyMessages(loc, record)
    })

    it('should track css setter properly', () => {
      const div = document.createElement('div')

      $(div).css('background-color', 'red')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should not track css getter', () => {
      const div = document.createElement('div')
      // @NOTE: jQuery will do initial process on dom while getting the first call of css getter
      $(div).css('background-color')
      receiver.reset()

      $(div).css('background-color')

      receiver.verifyNoMessage()
    })

    it('should track prop setter (class) properly', () => {
      const div = document.createElement('div')

      $(div).prop('class', 'class')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should not track prop getter (class)', () => {
      const div = document.createElement('div')

      $(div).prop('class')

      receiver.verifyNoMessage()
    })

    it('should track prop setter (style) properly', () => {
      const div = document.createElement('div')

      $(div).prop('style', 'background-color: red')
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should not track prop getter (style)', () => {
      const div = document.createElement('div')

      $(div).prop('style')

      receiver.verifyNoMessage()
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
      receiver.verifyMessages(loc, record)
    })

    it('should track hide properly', () => {
      const div = document.createElement('div')

      $(div).hide()
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
    })

    it('should track toggle properly', () => {
      const div = document.createElement('div')

      $(div).toggle()
      const loc = utils.getPrevLineSourceLocation()
      const record = utils.createRecord('1', ActionType.Style)
      const ownerID = utils.getOwnerOf(div).getTrackID()

      expect(ownerID).to.equal(record.trackid)
      receiver.verifyMessages(loc, record)
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
      receiver.verifyMessages(loc, record1)

      // for div2
      const record2 = utils.createRecord('2', ActionType.Style)
      const ownerID2 = utils.getOwnerOf(div2).getTrackID()

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMessages(loc, record2)
    })
  })

  describe('animation apis', () => {
    it('should track only animate and exclude all details of its implementation code', (done) => {
      const div = document.createElement('div')

      $(div).animate({ "top": "100px" }, 100, () => {
        const loc = utils.getPrevLineSourceLocation()
        const owner = utils.getOwnerOf(div)

        expect(owner.hasTrackID()).to.be.true

        const record = utils.createRecord(owner.getTrackID(), ActionType.Style)

        receiver.verifyMessages(loc, record)
        done()
      })
    })

    it('should track only specific animation (e.g., fadeIn, fadeOut) and exclude all details of its implementation code', (done) => {
      const div = document.createElement('div')

      $(div).fadeOut(100, () => {
        const loc = utils.getPrevLineSourceLocation()
        const owner = utils.getOwnerOf(div)

        expect(owner.hasTrackID()).to.be.true

        const record = utils.createRecord(owner.getTrackID(), ActionType.Style)

        receiver.verifyMessages(loc, record)
        done()
      })
    })

    it('should track other Style actions after animation finishes', (done) => {
      const div = document.createElement('div')

      $(div).slideUp(100, () => {
        receiver.reset()

        $(div).css('color', 'red')
        const loc = utils.getPrevLineSourceLocation()
        const owner = utils.getOwnerOf(div)

        expect(owner.hasTrackID()).to.be.true

        const record = utils.createRecord(owner.getTrackID(), ActionType.Style)

        receiver.verifyMessages(loc, record)
        done()
      })
    })

    it('should track other Style actions properly given animation executes only one tick ', () => {
      const div = document.createElement('div')

      $(div).fadeOut(0)
      receiver.reset()

      $(div).css('color', 'red')
      const loc = utils.getPrevLineSourceLocation()
      const owner = utils.getOwnerOf(div)

      expect(owner.hasTrackID()).to.be.true

      const record = utils.createRecord(owner.getTrackID(), ActionType.Style)

      receiver.verifyMessages(loc, record)
    })

    it('should track other Style actions during animation', (done) => {
      const div = document.createElement('div')
      const owner = utils.getOwnerOf(div)

      $(div).fadeOut(100, () => { done() })
      const loc1 = utils.getPrevLineSourceLocation()
      const record1 = utils.createRecord(owner.getTrackID(), ActionType.Style)

      $(div).css('color', 'red')
      const loc2 = utils.getPrevLineSourceLocation()
      const record2 = utils.createRecord(owner.getTrackID(), ActionType.Style)

      receiver.verifyListOfMessages([
        { loc: loc1, data: record1 },
        { loc: loc2, data: record2 }
      ])
    })

    it('should track delay animation properly', (done) => {
      const div = document.createElement('div')

      $(div).css('display', 'none')
      receiver.reset()

      $(div).delay(100).slideDown(100, () => {
        const loc = utils.getPrevLineSourceLocation()
        const owner = utils.getOwnerOf(div)

        expect(owner.hasTrackID()).to.be.true

        const record = utils.createRecord(owner.getTrackID(), ActionType.Style)

        receiver.verifyMessages(loc, record)
        done()
      })
    })

    it('should track stop properly', (done) => {
      const div = document.createElement('div')

      $(div).fadeOut(100)
      $(div)
        .stop()
        .queue(function () {
          receiver.reset()
          $(this).dequeue()
        })
        .fadeIn(100, () => {
          const loc = utils.getPrevLineSourceLocation()
          const owner = utils.getOwnerOf(div)

          expect(owner.hasTrackID()).to.be.true

          const record = utils.createRecord(owner.getTrackID(), ActionType.Style)

          receiver.verifyMessages(loc, record)
          done()
        })
    })

    it('should track double animation properly', (done) => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      // for div1
      $(div1).animate({ 'margin-top': '300px', 'opacity': 0 }, 100)
      const loc1 = utils.getPrevLineSourceLocation()
      const owner1 = utils.getOwnerOf(div1)

      expect(owner1.hasTrackID()).to.be.true

      const record1 = utils.createRecord(owner1.getTrackID(), ActionType.Style)

      receiver.verifyMessages(loc1, record1)
      receiver.reset()

      // for div2
      $(div2).animate({ 'top': -200 }, 100)
      const loc2 = utils.getPrevLineSourceLocation()
      // @NOTE: setTimeout to wait for animation executing of div2.
      // jquery will not execute second immediately, it will wait 
      // until next animate cycle and do animation after first one.
      setTimeout(() => {
        const owner2 = utils.getOwnerOf(div2)

        expect(owner2.hasTrackID()).to.be.true

        const record2 = utils.createRecord(owner2.getTrackID(), ActionType.Style)

        receiver.verifyMessages(loc2, record2)
        done()
      }, 10)
    })
  })
})