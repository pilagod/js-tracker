'use strict'

describe('getPropertyKeyOfString tests', () => {
  it('should call getPropertyKeyOfValue with key and computed', () => {
    sandbox.stub(esprimaParser, 'getPropertyKeyOfValue', sandbox.spy())

    esprimaParser.getPropertyKeyOfString('key', 'computed')

    expect(
      esprimaParser.getPropertyKeyOfValue
        .calledWithExactly('key', 'computed')
    ).to.be.true
  })

  it('should return string \'string\' given key value \'string\'', () => {
    sandbox.stub(esprimaParser, 'getPropertyKeyOfValue', () => 'string')

    expect(esprimaParser.getPropertyKeyOfString(null, null)).to.be.equal('string')
  })

  it('should return string \'1\' given key value 1', () => {
    sandbox.stub(esprimaParser, 'getPropertyKeyOfValue', () => 1)

    expect(esprimaParser.getPropertyKeyOfString(null, null)).to.be.equal('1')
  })

  it('should return string \'true\' given key value true', () => {
    sandbox.stub(esprimaParser, 'getPropertyKeyOfValue', () => true)

    expect(esprimaParser.getPropertyKeyOfString(null, null)).to.be.equal('true')
  })

  it('should return string \'null\' given key value null', () => {
    sandbox.stub(esprimaParser, 'getPropertyKeyOfValue', () => null)

    expect(esprimaParser.getPropertyKeyOfString(null, null)).to.be.equal('null')
  })

  it('should return string \'undefined\' given key value undefined', () => {
    sandbox.stub(esprimaParser, 'getPropertyKeyOfValue', () => undefined)

    expect(esprimaParser.getPropertyKeyOfString(null, null)).to.be.equal('undefined')
  })
})
