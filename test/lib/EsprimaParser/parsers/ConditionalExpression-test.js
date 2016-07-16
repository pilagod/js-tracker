// spec: https://github.com/estree/estree/blob/master/spec.md#conditionalexpression

describe('ConditionalExpression tests', () => {
  let conditionalExpression

  beforeEach(() => {
    conditionalExpression = createAstNode('ConditionalExpression', {
      test: createAstNode('ExpressionTest'),
      alternate: createAstNode('ExpressionAlternate'),
      consequent: createAstNode('ExpressionConsequent')
    })

    const parseNodeStub = createParseNodeStub()

    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(conditionalExpression.alternate)
        .returns(parseNodeStub(conditionalExpression.alternate))
      .withArgs(conditionalExpression.consequent)
        .returns(parseNodeStub(conditionalExpression.consequent))
  })

  it('should return parsed consequent given test true', () => {
    esprimaParser.parseNode
      .withArgs(conditionalExpression.test).returns(true)

    const result = esprimaParser.ConditionalExpression(conditionalExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(conditionalExpression.consequent)
    ).to.be.true
    expect(result).to.be.equal('parsedExpressionConsequent')
  })

  it('should return parsed alternate given test false', () => {
    esprimaParser.parseNode
      .withArgs(conditionalExpression.test).returns(false)

    const result = esprimaParser.ConditionalExpression(conditionalExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(conditionalExpression.alternate)
    ).to.be.true
    expect(result).to.be.equal('parsedExpressionAlternate')
  })
})
