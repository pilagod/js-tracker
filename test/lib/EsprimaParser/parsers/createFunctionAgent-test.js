describe('createFunctionAgent tests', () => {
  const parseFunctionInfoStub = {
    body: 'body',
    params: 'params'
  }
  const getEnvironmentStub = {
    scriptUrl: 'scriptUrl',
    closureStack: 'closureStack'
  }
  const getFunctionAgentParserStub = function () {}
  
  let functionExpression

  beforeEach(() => {
    functionExpression = createAstNode('FunctionExpression')

    sandbox.stub(esprimaParser, 'parseFunctionInfo')
      .returns(parseFunctionInfoStub)
    sandbox.stub(esprimaParser, 'getEnvironment')
      .returns(getEnvironmentStub)
    sandbox.stub(esprimaParser, 'FunctionAgent', function (init) {
      this.init = init
    })
  })

  it('should call getEnvironment with esprimaParser', () => {
    esprimaParser.createFunctionAgent(functionExpression)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(esprimaParser)
    ).to.be.true
  })

  it('should call parseFunctionInfo with functionExpression', () => {
    esprimaParser.createFunctionAgent(functionExpression)

    expect(
      esprimaParser.parseFunctionInfo
        .calledWithExactly(functionExpression)
    ).to.be.true
  })

  it('should create new instance of FunctionAgent init with an object concat all above results and return', () => {
    const expectedInit = Object.assign(
      getEnvironmentStub,
      parseFunctionInfoStub
    )
    const result = esprimaParser.createFunctionAgent(functionExpression)

    expect(result).to.be.instanceof(esprimaParser.FunctionAgent)
    expect(result.init).to.be.eql(expectedInit)
  })
})
