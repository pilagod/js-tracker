// spec: https://github.com/estree/estree/blob/master/spec.md#functions

describe('FunctionExpression tests', () => {
  const FunctionAgentStub = function () {}
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression', {
      params: [createAstNode('Pattern')],
      body: createAstNode('BlockStatement')
    })

    sandbox.stub(esprimaParser, 'FunctionAgent', FunctionAgentStub)
    // can not stub a function to an object
    sandbox.stub(esprimaParser.parseFunctionAgent, 'bind')
      .withArgs(esprimaParser)
        .returns('resultFromBind')
    sandbox.stub(esprimaParser, 'scriptUrl', 'resultFromScriptUrl')
    sandbox.stub(esprimaParser, 'closureStack', {
      getStack: sandbox.stub()
        .returns('resultFromGetStack')
    })
  })

  it('should call FunctionAgent with needed info and return a new FunctionAgent instance', () => {
    const functionAgentInitInfo = {
      body: functionExpression.body,
      params: functionExpression.params,
      parser: 'resultFromBind',
      scriptUrl: 'resultFromScriptUrl',
      closureStack: 'resultFromGetStack'
    }

    const result = esprimaParser.FunctionExpression(functionExpression)

    expect(
      esprimaParser.FunctionAgent
        .calledWithExactly(functionAgentInitInfo)
    ).to.be.true
    expect(result).to.be.instanceof(FunctionAgentStub)
  })
})
