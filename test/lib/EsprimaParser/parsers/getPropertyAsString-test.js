describe('getPropertyKeyAsString tests', () => {
  it('should call getPropertyKeyOfValue with key and computed', () => {
    sandbox.stub(esprimaParser, 'getPropertyValue', sandbox.spy())

    esprimaParser.getPropertyAsString('key', 'computed')

    expect(
      esprimaParser.getPropertyValue
        .calledWithExactly('key', 'computed')
    ).to.be.true
  })

  for (const value of ['string', 1, true, null, undefined]) {
    it(`should return string \'${value}\' given key value ${value}`, () => {
      sandbox.stub(esprimaParser, 'getPropertyValue', () => value)

      const result = esprimaParser.getPropertyAsString(null, null)

      expect(result).to.be.equal(`${value}`)
    })
  }
})
