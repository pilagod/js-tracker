import * as chai from 'chai'

const expect = chai.expect

describe.skip('injectscript', function () {
  it('should compatible with element default behaviors', () => {
    const div = document.createElement('div')

    div.accessKey = 'accessKey'
    expect(div.accessKey).to.be.equal('accessKey')

    div.contentEditable = 'true'
    expect(div.contentEditable).to.be.equal('true')

    div.dir = 'rtl'
    expect(div.dir).to.be.equal('rtl')
  })
})