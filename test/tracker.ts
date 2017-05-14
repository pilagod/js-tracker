import * as chai from 'chai'

const expect = chai.expect

describe('tracker', function () {
  let msgs

  before(function () {
    window.postMessage = function (msg) {
      msgs.push(msg)
    }
  })

  beforeEach(function () {
    msgs = []
  })

  it('should track HTMLElement actions', () => {
    const div = document.createElement('div')

    /* property test */
    div.accessKey = 'accessKey'

    /* method test */
    div.click()

    expect(div.dataset.trackid).to.equal('1')
  })
  it('should track DOMStringMap actions', () => {
    const div = document.createElement('div')

    div.dataset.data = 'data'
    expect(div.dataset.trackid).to.equal('1')
    expect(msgs).to.have.length(1)
    expect(msgs[0]).to.deep.equal({
      trackid: '1',
      target: 'DOMStringMap',
      action: 'data'
    })
  })
  // 'HTMLElement': object,
  // 'Element': object,
  // 'Node': object,
  // 'EventTarget': object,
  // 'Attr': object, // attr (e.g. attributes[0])
  // 'CSSStyleDeclaration': object, // style
  // 'DOMStringMap': object, // dataset
  // 'DOMTokenList': object, // classList
  // 'NamedNodeMap': object, // attributes
})