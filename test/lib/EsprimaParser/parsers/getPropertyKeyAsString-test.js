describe('getPropertyKeyAsString tests', () => {
  let key, computed

  beforeEach(() => {
    key = createAstNode('Expression')
    computed = 'boolean'
  })

  it('should call getPropertyKeyValue with key and computed', () => {
    sandbox.stub(esprimaParser, 'getPropertyKeyValue')

    esprimaParser.getPropertyKeyAsString(key, computed)

    expect(
      esprimaParser.getPropertyKeyValue
        .calledWithExactly(key, computed)
    ).to.be.true
  })

  for (const value of ['string', 1, true, null, undefined]) {
    it(`should return string \'${value}\' given key value ${value}`, () => {
      sandbox.stub(esprimaParser, 'getPropertyKeyValue')
        .returns(value)

      const result = esprimaParser.getPropertyKeyAsString(key, computed)

      expect(result).to.be.equal(`${value}`)
    })
  }
})
