// spec: https://github.com/estree/estree/blob/bc34a7cc861640aa8ee18d93186720be1b13db53/spec.md#unaryexpression

describe('UnaryExpression tests', () => {
  let unaryExpression
  // stub results
  const argument = 'argument'

  beforeEach(() => {
    unaryExpression = createAstNode('UnaryExpression', {
      argument: createAstNode('Expression')
    })
    sandbox.stub(esprimaParser, 'parseUnaryArgument')
      .returns(argument)
  })

  it('should call parseUnaryArgument with unaryExpression.argument and unaryExpression.operator', () => {
    unaryExpression.operator = 'unary'
    esprimaParser.unaryOperators.unary = function () {}

    esprimaParser.UnaryExpression(unaryExpression)

    expect(
      esprimaParser.parseUnaryArgument
        .calledWithExactly(
          unaryExpression.argument,
          unaryExpression.operator
        )
    ).to.be.true
  })

  it('should call delete operation with argument from parseUnaryArgument and return given delete operator', () => {
    const deleteStub = sandbox.stub().returns('resultFromDelete')

    unaryExpression.operator = 'delete'
    esprimaParser.unaryOperators.delete = deleteStub

    const result = esprimaParser.UnaryExpression(unaryExpression)

    expect(
      deleteStub
        .calledWithExactly(argument)
    ).to.be.true
    expect(result).to.be.equal('resultFromDelete')
  })

  it('should call unary operation with argument from parseUnaryArgument and return given unary operator', () => {
    const unaryStub = sandbox.stub().returns('resultFromUnary')

    unaryExpression.operator = 'unary'
    esprimaParser.unaryOperators.unary = unaryStub

    const result = esprimaParser.UnaryExpression(unaryExpression)

    expect(
      unaryStub
        .calledWithExactly(argument)
    ).to.be.true
    expect(result).to.be.equal('resultFromUnary')
  })
})
