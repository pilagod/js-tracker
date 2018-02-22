import { expect } from 'chai'
import $ from 'jquery'

import { RECORD_STORE_ADD } from '../../../src/extension/public/RecordStoreActions'
import ActionType from '../../../src/tracker/public/ActionType'
import OwnerManager from '../../../src/tracker/private/OwnerManager'
import trackJqueryApis from '../../../src/tracker/trackers/jquery/tracker'
import * as utils from './utils'

/* this test is based on dom tracker initialized in__init__.ts */

describe('jQuery API tracker', () => {
  const receiver = new utils.RecordStoreMessageCatcher(window, RECORD_STORE_ADD)

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

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should not track attr getter', () => {
      const div = document.createElement('div')

      $(div).attr('id')

      receiver.verifyNoMessage()
    })

    it('should track prop setter properly', () => {
      const div = document.createElement('div')

      $(div).prop('id', '1')

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
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

      const loc = utils.createSourceLocationWith(-2, 25)

      // for div1
      const data1 = utils.createActionData('1', ActionType.Attr)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div1)

      expect(ownerID1).to.equal(data1.trackid)

      // for div2
      const data2 = utils.createActionData('2', ActionType.Attr)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div2)

      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContain([
        { loc, data: data1 },
        { loc, data: data2 },
      ])
    })
  })

  describe('Behav action type', () => {
    it('should have no error when no matched element', () => {
      $(null).click()
      expect(true).to.be.true
    })

    it('should track click with no listener', () => {
      const div = document.createElement('div')

      $(div).click()

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContainExactly({ loc, data })
    })

    it('should track click with native listener', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.createSourceLocationWith(-2, 24)
      const data1 = utils.createActionData('1', ActionType.Style)

      receiver.reset()

      $(div).click()

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(data1.trackid)
      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 },
      ])
    })

    it('should track click with jquery listener', () => {
      const div = document.createElement('div')

      $(div).on('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.createSourceLocationWith(-2, 24)
      const data1 = utils.createActionData('1', ActionType.Style)

      receiver.reset()

      $(div).click()

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData('1', ActionType.Behav | ActionType.Event)

      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(data1.trackid)
      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 },
      ])
    })

    function createFocusableDiv() {
      const div = document.createElement('div')
      // @NOTE: https://stackoverflow.com/questions/3656467/is-it-possible-to-focus-on-a-div-using-javascript-focus-function
      // make div focusable (1) set tabIndex (2) attach to page
      div.tabIndex = -1
      document.body.appendChild(div)
      receiver.reset()

      return div
    }

    it('should track focus (which will use special trigger, same as blur) with no listener', () => {
      const div = createFocusableDiv()

      $(div).focus()

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContainExactly({ loc, data })
    })

    it('should track focus (which will use special trigger, same as blur) with native listener', () => {
      const div = createFocusableDiv()

      div.addEventListener('focus', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.createSourceLocationWith(-2, 24)
      const data1 = utils.createActionData('1', ActionType.Style)

      receiver.reset()

      $(div).focus()

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal('1')
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 }
      ])
    })

    it('should track focus (which will use special trigger, same as blur) with jquery listener', () => {
      const div = createFocusableDiv()

      $(div).on('focus', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.createSourceLocationWith(-2, 24)
      const data1 = utils.createActionData('1', ActionType.Style)

      receiver.reset()

      $(div).focus()

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal('1')
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 }
      ])
    })

    it('should track mouseenter (and those have no native trigger method like click()) and actions triggered by it properly', () => {
      const div = document.createElement('div')

      $(div).on('mouseenter', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.createSourceLocationWith(-2, 24)
      const data1 = utils.createActionData('1', ActionType.Style)

      receiver.reset()

      $(div).mouseenter()

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(data1.trackid)
      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 },
      ])
    })

    it('should track trigger and actions triggered by it properly (add native event listener)', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.createSourceLocationWith(-2, 24)
      const data1 = utils.createActionData('1', ActionType.Style)

      receiver.reset()

      $(div).trigger('click')

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(data1.trackid)
      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 }
      ])
    })

    it('should track trigger and actions triggered by it properly (add jquery event listener)', () => {
      const div = document.createElement('div')

      $(div).on('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.createSourceLocationWith(-2, 24)
      const data1 = utils.createActionData('1', ActionType.Style)

      receiver.reset()

      $(div).trigger('click')

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(data1.trackid)
      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 }
      ])
    })

    it('should track triggerHandler and actions triggered by it properly', () => {
      const div = document.createElement('div')
      // @NOTE: triggerHandler only trigger event registered by jquery 
      $(div).on('click', () => {
        div.style.color = 'red'
      })
      const loc1 = utils.createSourceLocationWith(-2, 24)
      const data1 = utils.createActionData('1', ActionType.Style)

      receiver.reset()

      $(div).triggerHandler('click')

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(data1.trackid)
      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 }
      ])
    })

    describe('low level api: event.trigger', () => {
      const ActionRecorder = require('../../../src/tracker/private/ActionRecorder').default

      it('should not data event.trigger given event is fired by page interaction (e.g., focusin -> event.simulate -> event.trigger)', () => {
        const div = document.createElement('div')

        $.event.trigger('click', null, div)

        expect(ActionRecorder.isRecording()).to.be.false
      })

      it('should not data anything during ajax executing', () => {
        // @NOTE: [http://api.jquery.com/jquery.ajax/]
        // use ajax to fetch javascript will load and execute immediately,
        // thus we use html file for this test
        return $.ajax({ method: 'GET', url: '/script.html' }).done(() => {
          expect(ActionRecorder.isRecording()).to.be.false
          receiver.verifyNoMessage()
        })
      })
    })
  })

  describe('Event action type', () => {
    it('should track ajax event properly', () => {
      const div = document.createElement('div')

      $(div).ajaxStart(() => { })

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track on (general event) properly', () => {
      const div = document.createElement('div')

      $(div).on('click', () => { })

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track click (explicit event) properly', () => {
      const div = document.createElement('div')

      $(div).click(() => { })

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track multiple targets of event action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).on('click', () => { })

      const loc = utils.createSourceLocationWith(-2, 25)

      // for div1
      const data1 = utils.createActionData('1', ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div1)

      expect(ownerID1).to.equal(data1.trackid)

      // for div2
      const data2 = utils.createActionData('2', ActionType.Event)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div2)

      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContain([
        { loc, data: data1 },
        { loc, data: data2 },
      ])
    })
  })

  describe('Node action type', () => {
    it('should track after properly', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      const content = `<span>content</span>`

      parent.appendChild(child)
      receiver.reset()
      // @NOTE: this data will be saved on parent
      $(child).after(content)

      const loc = utils.createSourceLocationWith(-2, 16)
      const data = utils.createActionData('1', ActionType.Node)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(parent)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track append properly', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')

      $(parent).append(child)

      const loc = utils.createSourceLocationWith(-2, 17)
      const data = utils.createActionData('1', ActionType.Node)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(parent)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track multiple targets of node action properly', () => {
      const parent1 = document.createElement('div')
      const parent2 = document.createElement('div')
      const child = document.createElement('div')

      $(parent1).add(parent2).append(child)

      const loc = utils.createSourceLocationWith(-2, 31)

      // for parent1
      const data1 = utils.createActionData('1', ActionType.Node)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(parent1)

      expect(ownerID1).to.equal(data1.trackid)

      // for parent2
      const data2 = utils.createActionData('2', ActionType.Node)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(parent2)

      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContain([
        { loc, data: data1 },
        { loc, data: data2 }
      ])
    })
  })

  describe('Style action type', () => {
    it('should track addClass properly', () => {
      const div = document.createElement('div')

      $(div).addClass('class')

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track css setter properly', () => {
      const div = document.createElement('div')

      $(div).css('background-color', 'red')

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
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

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should not track prop getter (class)', () => {
      const div = document.createElement('div')

      $(div).prop('class')

      receiver.verifyNoMessage()
    })

    it('should track prop setter (style) properly', () => {
      const div = document.createElement('div')

      $(div).prop('style', 'background-color: red')

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
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

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track hide properly', () => {
      const div = document.createElement('div')

      $(div).hide()

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track toggle properly', () => {
      const div = document.createElement('div')

      $(div).toggle()

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(data.trackid)
      receiver.verifyMessagesContain({ loc, data })
    })

    it('should track multiple targets of style action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).addClass('class')

      const loc = utils.createSourceLocationWith(-2, 25)

      // for div1
      const data1 = utils.createActionData('1', ActionType.Style)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div1)

      expect(ownerID1).to.equal(data1.trackid)

      // for div2
      const data2 = utils.createActionData('2', ActionType.Style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div2)

      expect(ownerID2).to.equal(data2.trackid)
      receiver.verifyMessagesContain([
        { loc, data: data1 },
        { loc, data: data2 },
      ])
    })
  })

  describe('animation apis', () => {
    it('should track only animate and exclude all details of its implementation code', (done) => {
      const div = document.createElement('div')

      $(div).animate({ "top": "100px" }, 100, () => {
        const loc = utils.createSourceLocationWith(-1, 14)
        const data = utils.createActionData(
          OwnerManager.getTrackIDFromItsOwner(div),
          ActionType.Style
        )
        receiver.verifyMessagesContainExactly({ loc, data })
        done()
      })
    })

    it('should track only specific animation (e.g., fadeIn, fadeOut) and exclude all details of its implementation code', (done) => {
      const div = document.createElement('div')

      $(div).fadeOut(100, () => {
        const loc = utils.createSourceLocationWith(-1, 14)
        const data = utils.createActionData(
          OwnerManager.getTrackIDFromItsOwner(div),
          ActionType.Style
        )
        receiver.verifyMessagesContainExactly({ loc, data })
        done()
      })
    })

    it('should track other Style actions after animation finishes', (done) => {
      const div = document.createElement('div')

      $(div).slideUp(100, () => {
        receiver.reset()
        $(div).css('color', 'red')

        const loc = utils.createSourceLocationWith(-2, 16)
        const data = utils.createActionData(
          OwnerManager.getTrackIDFromItsOwner(div),
          ActionType.Style
        )
        receiver.verifyMessagesContainExactly({ loc, data })
        done()
      })
    })

    it('should track other Style actions properly given animation executes only one tick ', () => {
      const div = document.createElement('div')

      $(div).fadeOut(0)
      receiver.reset()

      $(div).css('color', 'red')

      const loc = utils.createSourceLocationWith(-2, 14)
      const data = utils.createActionData(
        OwnerManager.getTrackIDFromItsOwner(div),
        ActionType.Style
      )
      receiver.verifyMessagesContainExactly({ loc, data })
    })

    it('should track other Style actions during animation', (done) => {
      const div = document.createElement('div')

      $(div).fadeOut(100, () => { done() })

      const loc1 = utils.createSourceLocationWith(-2, 14)
      const data1 = utils.createActionData(
        OwnerManager.getTrackIDFromItsOwner(div),
        ActionType.Style
      )
      $(div).css('color', 'red')

      const loc2 = utils.createSourceLocationWith(-2, 14)
      const data2 = utils.createActionData(
        OwnerManager.getTrackIDFromItsOwner(div),
        ActionType.Style
      )
      receiver.verifyMessagesContainExactly([
        { loc: loc1, data: data1 },
        { loc: loc2, data: data2 }
      ])
    })

    it('should track delay animation properly', (done) => {
      const div = document.createElement('div')

      $(div).css('display', 'none')
      receiver.reset()

      $(div).delay(100).slideDown(100, () => {
        const loc = utils.createSourceLocationWith(-1, 25)
        const data = utils.createActionData(
          OwnerManager.getTrackIDFromItsOwner(div),
          ActionType.Style
        )
        receiver.verifyMessagesContainExactly({ loc, data })
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
          const loc = utils.createSourceLocationWith(-1, 10)
          const data = utils.createActionData(
            OwnerManager.getTrackIDFromItsOwner(div),
            ActionType.Style
          )
          receiver.verifyMessagesContainExactly({ loc, data })
          done()
        })
    })

    it('should track double animation properly', (done) => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      // for div1
      $(div1).animate({ 'margin-top': '300px', 'opacity': 0 }, 100)

      const loc1 = utils.createSourceLocationWith(-2, 15)
      const data1 = utils.createActionData(
        OwnerManager.getTrackIDFromItsOwner(div1),
        ActionType.Style
      )
      receiver.verifyMessagesContainExactly({ loc: loc1, data: data1 })
      receiver.reset()

      // for div2
      $(div2).animate({ 'top': -200 }, 100)

      const loc2 = utils.createSourceLocationWith(-2, 15)
      // @NOTE: setTimeout to wait for animation executing of div2.
      // jquery will not execute second immediately, it will wait 
      // until next animate cycle and do animation after first one.
      setTimeout(() => {
        const data2 = utils.createActionData(
          OwnerManager.getTrackIDFromItsOwner(div2),
          ActionType.Style
        )
        receiver.verifyMessagesContainExactly({ loc: loc2, data: data2 })
        done()
      }, 10)
    })
  })
})