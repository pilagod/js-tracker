describe('createFunctionAgent tests', () => {
  const functionAgentData = {
    body: 'body',
    params: ['param1', 'param2', 'param3'],
    hoistings: ['var1', 'var2', 'var3'],
    scriptUrl: 'scriptUrl',
    closureStack: {}
  }
  const functionAgent = function () {}
  const functionArity = function (param1, param2, param3) {}
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression')

    sandbox.stub(esprimaParser, 'parseFunctionExpression').returns(functionAgentData)
    sandbox.stub(esprimaParser, 'wrapWithFunction').returns(functionAgent)
    sandbox.stub(esprimaParser, 'arity').returns(functionArity)
  })

  it('should call parseFunctionExpression with functionExpression', () => {
    esprimaParser.createFunctionAgent(functionExpression)

    expect(
      esprimaParser.parseFunctionExpression
        .calledWithExactly(functionExpression)
    ).to.be.true
  })

  it('should call wrapWithFunction with functionAgentData', () => {
    esprimaParser.createFunctionAgent(functionExpression)

    expect(
      esprimaParser.wrapWithFunction
        .calledWithExactly(functionAgentData)
    ).to.be.true
  })

  it('should return result from esprimaParser.arity called with params.length in functionAgentData and functionAgent', () => {
    const result = esprimaParser.createFunctionAgent(functionExpression)

    expect(
      esprimaParser.arity
        .calledWithExactly(
          functionAgentData.params.length,
          functionAgent
        )
    ).to.be.true
    expect(result).to.be.equal(functionArity)
  })
})
