describe('handleUnaryOperation tests', () => {
  let argument, unaryOperationSpy

  beforeEach(() => {
    argument = createAstNode('Expression')
    unaryOperationSpy = sandbox.spy(() => 'resultFromUnaryOperation')

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should call parseNode with argument', () => {
    esprimaParser.handleUnaryOperation(argument, unaryOperationSpy)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(argument)
    ).to.be.true
  })

  it('should pass result from parseNode to unary operation', () => {
    esprimaParser.handleUnaryOperation(argument, unaryOperationSpy)

    expect(
      unaryOperationSpy
        .calledWithExactly('parsedExpression')
    ).to.be.true
  })

  it('should return result from unary operation', () => {
    const result = esprimaParser.handleUnaryOperation(argument, unaryOperationSpy)

    expect(result).to.be.equal('resultFromUnaryOperation')
  })
})
