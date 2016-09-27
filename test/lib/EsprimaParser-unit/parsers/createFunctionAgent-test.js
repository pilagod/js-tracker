describe('createFunctionAgent tests', () => {
  const functionAgentData = {
    body: 'body',
    params: ['params'],
    scriptUrl: 'scriptUrl',
    closureStack: {}
  }
  const functionAgent = function () {}
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression')

    sandbox.stub(esprimaParser, 'parseFunctionExpression').returns(functionAgentData)
    sandbox.stub(esprimaParser, 'wrapFunctionAgentDataWithFunction').returns(functionAgent)
  })

  it('should call parseFunctionExpression with functionExpression', () => {
    esprimaParser.createFunctionAgent(functionExpression)

    expect(
      esprimaParser.parseFunctionExpression
        .calledWithExactly(functionExpression)
    ).to.be.true
  })

  it('should call wrapAgentDataWithFunction with result from parseFunctionExpression and return', () => {
    const result = esprimaParser.createFunctionAgent(functionExpression)

    expect(
      esprimaParser.wrapFunctionAgentDataWithFunction
        .calledWithExactly(functionAgentData)
    ).to.be.true
    expect(result).to.be.equal(functionAgent)
  })
})
