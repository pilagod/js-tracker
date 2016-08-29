describe('parseFunctionInfo tests', () => {
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression', {
      body: 'body',
      params: 'params'
    })

    sandbox.stub(esprimaParser, 'parseParams')
      .returns('resultFromParseParams')
  })

  it('should call parseParams with functionExpression params', () => {
    esprimaParser.parseFunctionInfo(functionExpression)

    expect(
      esprimaParser.parseParams
        .calledWithExactly(functionExpression.params)
    ).to.be.true
  })

  it('should return an object containing function expression body and params from parseParams', () => {
    const result = esprimaParser.parseFunctionInfo(functionExpression)

    expect(result).to.be.eql({
      body: functionExpression.body,
      params: 'resultFromParseParams'
    })
  })
})
