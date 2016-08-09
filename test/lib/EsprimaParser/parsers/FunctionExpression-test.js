// spec: https://github.com/estree/estree/blob/master/spec.md#functions

describe('FunctionExpression tests', () => {
  let functionExpression, functionAgentStub

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression')
    functionAgentStub = {
      prototype: {}
    }
    sandbox.stub(esprimaParser, 'createFunctionAgent')
      .returns(functionAgentStub)
  })

  it('should call createFunctionAgent with functionExpression', () => {
    esprimaParser.FunctionExpression(functionExpression)

    expect(
      esprimaParser.createFunctionAgent
        .calledWithExactly(functionExpression)
    ).to.be.true
  })

  it('should set functionAgent prototype\'s constructor to functionAgent', () => {
    esprimaParser.FunctionExpression(functionExpression)

    expect(functionAgentStub.prototype.constructor).to.be.equal(functionAgentStub)
  })

  it('should return result from createFunctionAgent', () => {
    const result = esprimaParser.FunctionExpression(functionExpression)

    expect(result).to.be.equal(functionAgentStub)
  })
})
