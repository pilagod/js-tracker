describe('getExpInfo tests', () => {
  it('should return an object containing code from escodegen called with expression, loc from expression.loc and scriptUrl from EsprimaParser', () => {
    const expression = createAstNode('MemberOrCallExpression')

    expression.loc = {}

    sandbox.stub(esprimaParser, 'scriptUrl', 'scriptUrl')
    sandbox.stub(esprimaParser, 'escodegen', {
      generate: sandbox.stub()
        .withArgs(expression).returns('resultFromEscodegen')
    })
    const result = esprimaParser.getExpInfo(expression)

    expect(result).to.be.eql({
      code: 'resultFromEscodegen',
      loc: expression.loc,
      scriptUrl: 'scriptUrl'
    })
  })
})
