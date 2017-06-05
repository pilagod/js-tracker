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
    caller: TrackTarget,
    trackid: string,
    target: string,
    action: Action,
    stacktrace?: string,
    actionTag?: string,
    merge?: string,
  }

  function matchTrackData(got: TrackData, expected: ExpectData) {
    expect(expected.caller._owner)
      .to.have.property('_trackid')
      .to.equal(expected.trackid)

    expect(got)
      .to.have.property('trackid')
      .to.equal(expected.trackid)

    expect(got)
      .to.have.property('target')
      .to.equal(expected.target)

    expect(got)
      .to.have.property('action')
      .to.equal(expected.action)

    if (!expected.stacktrace) {
      expect(got.stacktrace[1])
        .to.have.property('functionName')
        .to.equal(`${expected.caller.constructor.name}.${expected.action}`)
    } else {
      expect(got.stacktrace[1])
        .to.have.property('functionName')
        .to.equal(expected.stacktrace)
    }
  }

  describe('HTMLElement', () => {
    it('should track property assignment', () => {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'

      expect(msgs).to.have.length(1)

      matchTrackData(msgs[0], {
        caller: div,
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
        caller: div,
        trackid: '1',
        target: 'HTMLElement',
        action: 'click'
      })
    })

    /* anomalies */

    it('should track dataset property assignment', () => {
      const div = document.createElement('div')

      div.dataset.data = 'data'

      expect(msgs).to.have.length(1)

      matchTrackData(msgs[0], {
        caller: div.dataset,
        trackid: '1',
        target: 'DOMStringMap',
        action: 'data',
        stacktrace: 'Object.set'
      })
    })

    it('should track style property assignment', () => {
      const div = document.createElement('div')

      div.style.color = 'red'

      expect(msgs).to.have.length(1)

      matchTrackData(msgs[0], {
        caller: div.style,
        trackid: '1',
        target: 'CSSStyleDeclaration',
        action: 'color',
        stacktrace: 'Object.set'
      })
    })
  })

  describe('Element', () => {
    it('should track property assignment', () => {
      const div = document.createElement('div')

      div.id = 'id'

      expect(msgs).to.have.length(1)

      matchTrackData(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Element',
        action: 'id'
      })
    })

    it('should track method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.insertAdjacentElement('afterbegin', div2)

      expect(msgs).to.have.length(1)

      matchTrackData(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Element',
        action: 'insertAdjacentElement'
      })
    })

    /* anomalies */


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