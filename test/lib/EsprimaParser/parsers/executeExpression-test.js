describe('executeExpression tests', () => {
  const getReferenceStub = {
    object: 'object'
  }
  let reduceStub, data

  beforeEach(() => {
    reduceStub = {}
    data = {
      reduce: sandbox.stub().returns(reduceStub)
    }
    sandbox.stub(esprimaParser, 'isValidStyleOrDOMTokenList')
    sandbox.stub(esprimaParser, 'getReference')
      .returns(getReferenceStub)
  })

  it('should call reduce of data with executeReducer and undefined', () => {
    esprimaParser.executeExpression(data)

    expect(
      data.reduce
        .calledWithExactly(esprimaParser.executeReducer, undefined)
    ).to.be.true
  })

  it('should call isValidStyleOrDOMTokenList with result from reduce', () => {
    esprimaParser.executeExpression(data)

    expect(
      esprimaParser.isValidStyleOrDOMTokenList
        .calledWithExactly(reduceStub)
    ).to.be.true
  })

  it('should call getReference with data given isValidStyleOrDOMTokenList returns true', () => {
    esprimaParser.isValidStyleOrDOMTokenList.returns(true)

    esprimaParser.executeExpression(data)

    expect(
      esprimaParser.getReference
        .calledWithExactly(data)
    ).to.be.true
  })

  it('should set parent of result from reduce to object of result from getReference given isValidStyleOrDOMTokenList returns true', () => {
    esprimaParser.isValidStyleOrDOMTokenList.returns(true)

    esprimaParser.executeExpression(data)

    expect(reduceStub.parent).to.be.equal(getReferenceStub.object)
  })

  it('should return result from reduce of data', () => {
    const result = esprimaParser.executeExpression(data)

    expect(result).to.be.equal(reduceStub)
  })
})
