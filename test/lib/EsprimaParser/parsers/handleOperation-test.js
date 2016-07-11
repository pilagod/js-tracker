describe('handleUnaryOperation tests', () => {
  let argument, unaryOperationSpy

  beforeEach(() => {
    argument = createAstNode('Literal', {value: 'parsedArgument'})
    unaryOperationSpy = sandbox.spy(() => 'resultFromUnaryOperation')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(createLiteralStub()))
  })

  it('should call parseNode with argument', () => {
    esprimaParser.handleOperation(argument, () => {})

    expect(
      esprimaParser.parseNode
        .calledWithExactly(argument)
    ).to.be.true
  })

  it('should pass result from parseNode to unary operation', () => {
    esprimaParser.handleOperation(argument, unaryOperationSpy)

    expect(unaryOperationSpy.calledWithExactly('parsedArgument')).to.be.true
  })

  it('should return result from unary operation', () => {
    const result = esprimaParser.handleOperation(argument, unaryOperationSpy)

    expect(result).to.be.equal('resultFromUnaryOperation')
  })
})
