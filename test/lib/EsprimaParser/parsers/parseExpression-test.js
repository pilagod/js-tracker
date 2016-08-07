describe('parseExpression tests', () => {
  let expression

  beforeEach(() => {
    expression = createAstNode('MemberOrCallExpression')

    sandbox.stub(esprimaParser, 'transformExpressionToData')
      .returns('resultFromTransformExpressionToData')
    sandbox.stub(esprimaParser, 'parseExpressionInfo')
      .returns('resultFromParseExpressionInfo')
  })

  it('should call transformExpressionToData with expression', () => {
    esprimaParser.parseExpression(expression)

    expect(
      esprimaParser.transformExpressionToData
        .calledWithExactly(expression)
    ).to.be.true
  })

  it('should call parseExpressionInfo with expression', () => {
    esprimaParser.parseExpression(expression)

    expect(
      esprimaParser.parseExpressionInfo
        .calledWithExactly(expression)
    ).to.be.true
  })

  it('should return an object containing result from above', () => {
    const result = esprimaParser.parseExpression(expression)

    expect(result).to.be.eql({
      data: 'resultFromTransformExpressionToData',
      info: 'resultFromParseExpressionInfo'
    })
  })
})
