// spec: https://github.com/estree/estree/blob/master/spec.md#binaryexpression

describe('BinaryExpression tests', () => {
  let binaryExpression

  beforeEach(() => {
    binaryExpression = createAstNode('BinaryExpression', {
      operator: 'binaryOperator',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
    sandbox.stub(esprimaParser, 'binaryOperators', {
      'binaryOperator': sandbox.stub()
        .returns('resultFromBinaryOperator')
    })
  })

  it('should call parseNode with left', () => {
    esprimaParser.BinaryExpression(binaryExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(binaryExpression.left)
    ).to.be.true
  })

  it('should call parseNode with right', () => {
    esprimaParser.BinaryExpression(binaryExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(binaryExpression.right)
    ).to.be.true
  })

  it('should call proper binary operation with parsed left and right then return the result', () => {
    const result = esprimaParser.BinaryExpression(binaryExpression)

    expect(
      esprimaParser.binaryOperators.binaryOperator
        .calledWithExactly('parsedExpressionLeft', 'parsedExpressionRight')
    ).to.be.true
    expect(result).to.be.equal('resultFromBinaryOperator')
  })
})
