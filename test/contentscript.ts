import { expect } from 'chai'
import * as sinon from 'sinon'

import OwnerManager from '../src/tracker/OwnerManager'

describe.skip('contentscript', () => {
  const trackerMessage = window.postMessage

  describe('onDevtoolsSelectionChanged', () => {
    const chrome = window.chrome
    const messageSpy = sinon.spy()

    before(() => {
      (<any>window).chrome = {
        runtime: {
          sendMessage: messageSpy
        }
      }
    })

    after(() => {
      (<any>window).chrome = chrome
    })

    it('should send proper message given a element that has already produced records', () => {
    })
  })
})