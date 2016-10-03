// spec: https://github.com/estree/estree/blob/master/spec.md#functions

describe('FunctionExpression tests', () => {
  const functionAgentData = {
    body: 'BlockStatement',
    params: ['params'],
    scriptUrl: 'scriptUrl',
    closureStack: {}
  }
  const functionAgent = function () {}
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression')

    sandbox.stub(esprimaParser, 'parseFunctionExpression').returns(functionAgentData)
    sandbox.stub(esprimaParser, 'wrapWithFunction')
      .returns(functionAgent)
    sandbox.stub(esprimaParser, 'setFunctionExpressionTo')
  })

  it('should call parseFunctionExpression with functionExpression', () => {
    esprimaParser.FunctionExpression(functionExpression)

    expect(
      esprimaParser.parseFunctionExpression
        .calledWithExactly(functionExpression)
    ).to.be.true
  })

  it('should call wrapWithFunction with functionAgentData and return', () => {
    esprimaParser.FunctionExpression(functionExpression)

    expect(
      esprimaParser.wrapWithFunction
        .calledWithExactly(functionAgentData)
    ).to.be.true
  })

  it('should call setFunctionExpressionTo with functionAgentData, functionExpression.id and functionAgent given non-null id', () => {
    functionExpression.id = createAstNode('Identifier')

    esprimaParser.FunctionExpression(functionExpression)

    expect(
      esprimaParser.setFunctionExpressionTo
        .calledWithExactly(functionAgentData, functionExpression.id, functionAgent)
    ).to.be.true
  })

  it('should not call setFunctionExpressionTo given null id', () => {
    esprimaParser.FunctionExpression(functionExpression)

    expect(esprimaParser.setFunctionExpressionTo.called).to.be.false
  })

  it('should return result from wrapWithFunction', () => {
    const result = esprimaParser.FunctionExpression(functionExpression)

    expect(result).to.be.equal(functionAgent)
  })
})
