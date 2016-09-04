describe('getTargetElements tests', () => {
  const getStub = []
  let object

  beforeEach(() => {
    object = {
      get: sandbox.stub().returns(getStub)
    }
    sandbox.stub(esprimaParser, 'isJquery')
  })

  it('should call isJquery with object', () => {
    esprimaParser.getTargetElements(object)

    expect(
      esprimaParser.isJquery
        .calledWithExactly(object)
    ).to.be.true
  })

  it('should return get of object given isJquery called with object returns true', () => {
    esprimaParser.isJquery.withArgs(object).returns(true)

    const result = esprimaParser.getTargetElements(object)

    expect(result).to.be.equal(getStub)
  })

  it('should return an array containing object given isJquery called with object returns false', () => {
    esprimaParser.isJquery.withArgs(object).returns(false)

    const result = esprimaParser.getTargetElements(object)

    expect(result).to.be.eql([object])
  })
})
