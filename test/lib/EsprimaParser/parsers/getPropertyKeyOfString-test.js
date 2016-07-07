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

  for (const value of ['string', 1, true, null, undefined]) {
    it(`should return string \'${value}\' given key value ${value}`, () => {
      sandbox.stub(esprimaParser, 'getPropertyKeyOfValue', () => value)

      expect(esprimaParser.getPropertyKeyOfString(null, null)).to.be.equal(`${value}`)
    })
  }
})
