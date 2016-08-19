describe('isStyleOrDOMTokenList tests', () => {
  const executedData = 'executedData'
  const contextStub = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'closureStack', {
      getContext: sandbox.stub().returns(contextStub)
    })
    sandbox.stub(esprimaParser, 'isStyle')
    sandbox.stub(esprimaParser, 'isDOMTokenList')
  })

  it('should call getContext of closureStack', () => {
    esprimaParser.isStyleOrDOMTokenList(executedData)

    expect(esprimaParser.closureStack.getContext.called).to.be.true
  })

  it('should call isStyle with context and executedData', () => {
    esprimaParser.isStyleOrDOMTokenList(executedData)

    expect(
      esprimaParser.isStyle
        .calledWithExactly(contextStub, executedData)
    ).to.be.true
  })

  it('should call isDOMTokenList with context and executedData given isStyle returns false', () => {
    esprimaParser.isStyle.returns(false)

    esprimaParser.isStyleOrDOMTokenList(executedData)

    expect(
      esprimaParser.isDOMTokenList
        .calledWithExactly(contextStub, executedData)
    ).to.be.true
  })

  it('should not call isDOMTokenList given isStyle returns true', () => {
    esprimaParser.isStyle.returns(true)

    esprimaParser.isStyleOrDOMTokenList(executedData)

    expect(esprimaParser.isDOMTokenList.called).to.be.false
  })

  it('should return true given isStyle returns true', () => {
    esprimaParser.isStyle.returns(true)

    const result = esprimaParser.isStyleOrDOMTokenList(executedData)

    expect(result).to.be.true
  })

  it('should return true given isStyle returns false and isDOMTokenList returns true', () => {
    esprimaParser.isStyle.returns(false)
    esprimaParser.isDOMTokenList.returns(true)

    const result = esprimaParser.isStyleOrDOMTokenList(executedData)

    expect(result).to.be.true
  })

  it('should return false given isStyle and isDOMTokenList both return false', () => {
    esprimaParser.isStyle.returns(false)
    esprimaParser.isDOMTokenList.returns(false)

    const result = esprimaParser.isStyleOrDOMTokenList(executedData)

    expect(result).to.be.false
  })
})
