describe('parseFunctionInfo tests', () => {
  const paramNames = ['param1', 'param2', 'param3']
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression', {
      body: 'body',
      params: 'params'
    })
    sandbox.stub(esprimaParser, 'parseFunctionParamsName')
      .returns(paramNames)
  })

  it('should call parseFunctionParamsName with functionExpression params', () => {
    esprimaParser.parseFunctionInfo(functionExpression)

    expect(
      esprimaParser.parseFunctionParamsName
        .calledWithExactly(functionExpression.params)
    ).to.be.true
  })

  it('should return an object containing function expression body and params from parseParams', () => {
    const result = esprimaParser.parseFunctionInfo(functionExpression)

    expect(result).to.be.eql({
      body: functionExpression.body,
      params: paramNames
    })
  })
})
