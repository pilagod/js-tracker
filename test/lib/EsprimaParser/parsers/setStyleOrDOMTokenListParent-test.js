describe('setStyleOrClassListParent tests', () => {
  const data = 'data'
  const getReferenceStub = {
    object: 'object',
    property: 'property'
  }
  let executedData

  beforeEach(() => {
    executedData = {}

    sandbox.stub(esprimaParser, 'isValidStyleOrDOMTokenList')
    sandbox.stub(esprimaParser, 'getReference')
      .returns(getReferenceStub)
  })

  it('should call isValidStyleOrDOMTokenList with executedData', () => {
    esprimaParser.setStyleOrDOMTokenListParent(data, executedData)

    expect(
      esprimaParser.isValidStyleOrDOMTokenList
        .calledWithExactly(executedData)
    ).to.be.true
  })

  it('should call getReference with data given isStyleOrClassList returns true', () => {
    esprimaParser.isValidStyleOrDOMTokenList.returns(true)

    esprimaParser.setStyleOrDOMTokenListParent(data, executedData)

    expect(
      esprimaParser.getReference
        .calledWithExactly(data)
    ).to.be.true
  })

  it('should set executedData\'s property \'parent\' to the  object got from getReference', () => {
    esprimaParser.isValidStyleOrDOMTokenList.returns(true)

    esprimaParser.setStyleOrDOMTokenListParent(data, executedData)

    expect(executedData.parent).to.be.eql(getReferenceStub.object)
  })
})
