// spec: https://github.com/estree/estree/blob/master/spec.md#logicalexpression

describe('LogicalExpression tests', () => {
  let logicalExpression

  beforeEach(() => {
    logicalExpression = createAstNode('LogicalExpression', {
      operator: 'logicalOperator',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })
    sandbox.stub(esprimaParser, 'logicalOperators', {
      'logicalOperator': sandbox.stub()
        .returns('resultFromLogicalOperator')
    })
  })

  it('should call proper logical operation with left and right then return', () => {
    const result = esprimaParser.LogicalExpression(logicalExpression)

    expect(
      esprimaParser.logicalOperators.logicalOperator
        .calledWithExactly(logicalExpression.left, logicalExpression.right)
    ).to.be.true
    expect(result).to.be.equal('resultFromLogicalOperator')
  })
})
