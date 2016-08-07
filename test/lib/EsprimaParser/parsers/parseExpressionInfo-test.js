describe('parseExpressionInfo tests', () => {
  it('should return an object containing code from escodegen called with expression and loc from expression.loc', () => {
    const expression = createAstNode('MemberOrCallExpression')
    expression.loc = {}

    sandbox.stub(esprimaParser, 'escodegen')
      .withArgs(expression)
        .returns('resultFromEscodegen')

    const result = esprimaParser.parseExpressionInfo(expression)

    expect(result).to.be.eql({
      code: 'resultFromEscodegen',
      loc: expression.loc
    })
  })
})
