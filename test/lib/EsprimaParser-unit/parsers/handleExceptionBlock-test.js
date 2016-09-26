describe('handleExceptionBlock tests', () => {
  const value = 'resultFromParseExceptionBlock'
  let block, exceptionResult

  beforeEach(() => {
    block = createAstNode('BlockStatement')
    exceptionResult = {value}

    sandbox.stub(esprimaParser, 'parseNode').returns(value)
    sandbox.stub(esprimaParser, 'getExceptionBlockResult').returns(exceptionResult)
  })

  it('should call parseNode with block', () => {
    esprimaParser.handleExceptionBlock(block)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(block)
    ).to.be.true
  })

  it('should call getExceptionBlockResult with result from parseNode and return', () => {
    const result = esprimaParser.handleExceptionBlock(block)

    expect(
      esprimaParser.getExceptionBlockResult
        .calledWithExactly(value)
    ).to.be.true
    expect(result).to.be.eql({value})
  })
})
