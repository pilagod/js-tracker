import { expect } from 'chai'
import $ from 'jquery'

import ActionType from '../../src/tracker/public/ActionType'
import {
  attachListenerTo,
  detachListenerFrom
} from '../../src/tracker/private/NativeUtils'

import * as utils from './utils'

describe('jQuery API tracker', () => {
  const {
    messages,
    resetMessages,
    trackerMessageHandler
  } = utils.makeTrackerMessageHandler()

  before(() => {
    attachListenerTo(window, 'js-tracker', trackerMessageHandler)
  })

  after(() => {
    detachListenerFrom(window, 'js-tracker', trackerMessageHandler)
  })

  beforeEach(() => {
    // @NOTE: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
    // in order to keep reference of msgs, we can only set length to 0
    resetMessages()
  })

  describe('style action type', () => {
    it('should track addClass properly', () => {
      const div = document.createElement('div')

      $(div).addClass('class')
      const loc = utils.getPrevLineSourceLocation()

      utils.matchActionInfo(messages[0], <ExpectInfo>{
        caller: div,
        trackid: '1',
        type: ActionType.Style,
        loc
      })
    })

    it('should track css setter properly', () => {
      const div = document.createElement('div')

      $(div).css('background-color', 'red')
      const loc = utils.getPrevLineSourceLocation()

      utils.matchActionInfo(
        messages[0],
        utils.makeExpectInfo(div, '1', ActionType.Style, loc)
      )
    })

    it('should track prop (class) properly', () => {
      const div = document.createElement('div')

      $(div).prop('class', 'class')
      const loc = utils.getPrevLineSourceLocation()

      utils.matchActionInfo(
        messages[0],
        utils.makeExpectInfo(div, '1', ActionType.Style, loc)
      )
    })

    it('should track prop (style) properly', () => {
      const div = document.createElement('div')

      $(div).prop('style', 'background-color: red')
      const loc = utils.getPrevLineSourceLocation()

      utils.matchActionInfo(
        messages[0],
        utils.makeExpectInfo(div, '1', ActionType.Style, loc)
      )
    })

    it('should track show properly', () => {
      const div = document.createElement('div')

      $(div).hide()
      $(div).show()
      const loc = utils.getPrevLineSourceLocation()

      utils.matchActionInfo(
        messages[1],
        utils.makeExpectInfo(div, '1', ActionType.Style, loc)
      )
    })

    it('should track hide properly', () => {
      const div = document.createElement('div')

      $(div).hide()
      const loc = utils.getPrevLineSourceLocation()

      utils.matchActionInfo(
        messages[0],
        utils.makeExpectInfo(div, '1', ActionType.Style, loc)
      )
    })

    it.skip('should track toggle properly', () => {
      const div = document.createElement('div')

      $(div).toggle()
      const loc1 = utils.getPrevLineSourceLocation()
      // $(div).toggle()
      // const loc2 = utils.getPrevLineSourceLocation()

      utils.matchActionInfo(
        messages[0],
        utils.makeExpectInfo(div, '1', ActionType.Style, loc1)
      )
      // utils.matchActionInfo(
      //   messages[1],
      //   utils.makeExpectInfo(div, '1', ActionType.Style, loc2)
      // )
    })
  })
})