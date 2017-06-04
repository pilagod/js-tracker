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

  type ExpectedData = {
    caller: TrackTarget,
    trackid: string,
    target: string,
    action: Action,
    actionTag?: string,
    merge?: string
  }

  function matchTrackData(got: TrackData, expected: ExpectedData) {
    expect(expected.caller._owner.dataset)
      .to.have.property('trackid')
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

    expect(got.stacktrace[1])
      .property('functionName')
      .to.equal(`${expected.caller.constructor.name}.${expected.action}`)
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