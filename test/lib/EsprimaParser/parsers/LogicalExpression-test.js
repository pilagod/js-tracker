// spec: https://github.com/estree/estree/blob/master/spec.md#logicalexpression

describe('LogicalExpression tests', () => {
  let logicalExpression

  beforeEach(() => {
    logicalExpression = createAstNode('LogicalExpression', {
      operator: 'logicalOperator',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
    sandbox.stub(esprimaParser, 'logicalOperators', {
      'logicalOperator': sandbox.stub()
        .returns('resultFromLogicalOperator')
    })
  })

  it('should call parseNode with left', () => {
    esprimaParser.LogicalExpression(logicalExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(logicalExpression.left)
    ).to.be.true
  })

  it('should call parseNode with right', () => {
    esprimaParser.LogicalExpression(logicalExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(logicalExpression.right)
    ).to.be.true
  })

  it('should call proper logical operation with parsed left and right', () => {
    const result = esprimaParser.LogicalExpression(logicalExpression)

    expect(
      esprimaParser.logicalOperators.logicalOperator
        .calledWithExactly('parsedExpressionLeft', 'parsedExpressionRight')
    ).to.be.true
    expect(result).to.be.equal('resultFromLogicalOperator')
  })
})
