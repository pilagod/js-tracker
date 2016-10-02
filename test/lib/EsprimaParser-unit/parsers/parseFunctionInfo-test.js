describe('parseFunctionInfo tests', () => {
  const params = ['param1', 'param2', 'param3']
  const hoistings = ['var1', 'var2', 'var3']
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression', {
      body: createAstNode('BlockStatement'),
      params: [createAstNode('Pattern')]
    })
    sandbox.stub(esprimaParser, 'parseFunctionParams').returns(params)
    sandbox.stub(esprimaParser, 'searchHoistings').returns(hoistings)
  })

  it('should call parseFunctionParams with functionExpression params', () => {
    esprimaParser.parseFunctionInfo(functionExpression)

    expect(
      esprimaParser.parseFunctionParams
        .calledWithExactly(functionExpression.params)
    ).to.be.true
  })

  it('should call searchHoistings with an array containing functionExpression.body', () => {
    esprimaParser.parseFunctionInfo(functionExpression)

    expect(
      esprimaParser.searchHoistings
        .calledWithExactly([functionExpression.body])
    ).to.be.true
  })

  it('should return an object containing function expression body, params from parseFunctionParams and hoistings from searchHoistings', () => {
    const result = esprimaParser.parseFunctionInfo(functionExpression)

    expect(result).to.be.eql({
      body: functionExpression.body,
      params,
      hoistings
    })
  })
})
