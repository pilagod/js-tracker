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
  // const FunctionAgentStub = function () {}
  // let functionExpression
  //
  // beforeEach(() => {
  //   functionExpression = createAstNode('FunctionExpression', {
  //     params: [createAstNode('Pattern')],
  //     body: createAstNode('BlockStatement')
  //   })
  //
  //   sandbox.stub(esprimaParser, 'FunctionAgent', FunctionAgentStub)
  //   // can not stub a function to an object
  //   sandbox.stub(esprimaParser.parseFunctionAgent, 'bind')
  //     .withArgs(esprimaParser)
  //       .returns('resultFromBind')
  //   sandbox.stub(esprimaParser, 'scriptUrl', 'resultFromScriptUrl')
  //   sandbox.stub(esprimaParser, 'closureStack', {
  //     getStack: sandbox.stub()
  //       .returns('resultFromGetStack')
  //   })
  // })
  //
  // it('should call FunctionAgent with needed info and return a new FunctionAgent instance', () => {
  //   const functionAgentInitInfo = {
  //     body: functionExpression.body,
  //     params: functionExpression.params,
  //     parser: 'resultFromBind',
  //     scriptUrl: 'resultFromScriptUrl',
  //     closureStack: 'resultFromGetStack'
  //   }
  //
  //   const result = esprimaParser.FunctionExpression(functionExpression)
  //
  //   expect(
  //     esprimaParser.FunctionAgent
  //       .calledWithExactly(functionAgentInitInfo)
  //   ).to.be.true
  //   expect(result).to.be.instanceof(FunctionAgentStub)
  // })
})
