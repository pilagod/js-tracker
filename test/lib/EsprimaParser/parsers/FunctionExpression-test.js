// spec: https://github.com/estree/estree/blob/master/spec.md#functions

describe('FunctionExpression tests', () => {
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression')

    sandbox.stub(esprimaParser, 'createFunctionAgent')
      .returns('resultFromCreateFunctionAgent')
    sandbox.stub(esprimaParser, 'wrapFunctionAgentWithFunction')
      .returns('resultFromWrapFunctionAgentWithFunction')
  })

  it('should call createFunctionAgent with functionExpression', () => {
    esprimaParser.FunctionExpression(functionExpression)

    expect(
      esprimaParser.createFunctionAgent
        .calledWithExactly(functionExpression)
    ).to.be.true
  })

  it('should call wrapFunctionAgentWithFunction with result from createFunctionAgent and return', () => {
    const result = esprimaParser.FunctionExpression(functionExpression)

    expect(result).to.be.equal('resultFromWrapFunctionAgentWithFunction')
  })
})
