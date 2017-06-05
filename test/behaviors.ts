import * as chai from 'chai'

const expect = chai.expect

describe('tracker\'s behaviors', function () {
  let msgs: TrackData[]

  before(function () {
    window.postMessage = function (msg) {
      msgs.push(msg)
    }
  })

  beforeEach(function () {
    msgs = []
  })

  type ExpectData = {
    trackid: string,
    target: string,
    action: Action,
    actionTag?: string,
    merge?: string
  }

  function matchTrackData(got: TrackData, expected: ExpectData) {
    expect(got)
      .to.have.property('trackid')
      .to.equal(expected.trackid)

    expect(got)
      .to.have.property('target')
      .to.equal(expected.target)

    expect(got)
      .to.have.property('action')
      .to.equal(expected.action)
  }

  describe('HTMLElement', () => {
    it('should track property assignment', () => {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'

      expect(msgs).to.have.length(1)

      matchTrackData(msgs[0], {
        trackid: '1',
        target: 'HTMLElement',
        action: 'accessKey',
      })
    })

    it('should track method call', () => {
      const div = document.createElement('div')

      div.click()

      expect(msgs).to.have.length(1)

      matchTrackData(msgs[0], {
        trackid: '1',
        target: 'HTMLElement',
        action: 'click'
      })
    })

    /* anomalies */

    // @NOTE: dataset is a specially special case
    it('should track dataset property assignment', () => {
    })

    it('should track style property assignment', () => {
    })
  })

  describe('Element', () => {

  })

  describe('Node', () => {

  })

  describe('EventTarget', () => {

  })

  describe('Attr', () => {

  })

  describe('CSSStyleDeclaration', () => {

  })

  describe('DOMStringMap', () => {

  })

  describe('DOMTokenList', () => {

  })

  describe('NamedNodeMap', () => {

  })
})