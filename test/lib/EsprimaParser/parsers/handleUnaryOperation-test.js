describe('handleUnaryOperation tests', () => {
  let argument, unaryOperationSpy

  beforeEach(() => {
    argument = createAstNode()
    unaryOperationSpy = sandbox.spy(() => 'resultFromUnaryOperation')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => 'parsedArgument'))
  })

  it('should call parseNode with argument', () => {
    esprimaParser.handleUnaryOperation(argument, () => {})

    expect(
      esprimaParser.parseNode
        .calledWithExactly(argument)
    ).to.be.true
  })

  it('should pass result from parseNode to unary operation', () => {
    esprimaParser.handleUnaryOperation(argument, unaryOperationSpy)

    expect(unaryOperationSpy.calledWithExactly('parsedArgument')).to.be.true
  })

  it('should return result from unary operation', () => {
    const result = esprimaParser.handleUnaryOperation(argument, unaryOperationSpy)

    expect(result).to.be.equal('resultFromUnaryOperation')
  })
})
