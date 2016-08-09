describe('parseFunctionAgent tests', () => {
  const functionAgent = {
    body: 'body',
    params: 'params'
  }
  const context = 'context'
  const calledArguments = ['arg1', 'arg2', 'arg3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getEnvironment')
    sandbox.stub(esprimaParser, 'setFunctionEnvironment')
    sandbox.stub(esprimaParser, 'setFunctionContext')
    sandbox.stub(esprimaParser, 'setFunctionArguments')
    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'resetEnvironment')
  })

  it('should call getEnvironment', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(esprimaParser.getEnvironment.called).to.be.true
  })

  it('should call setFunctionEnvironment with functionAgent after getEnvironment', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.setFunctionEnvironment
        .calledWithExactly(functionAgent)
    ).to.be.true
    expect(
      esprimaParser.setFunctionEnvironment
        .calledAfter(esprimaParser.getEnvironment)
    ).to.be.true
  })

  it('should call setFunctionContext with context', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.setFunctionContext
        .calledWithExactly(context)
    ).to.be.true
  })

  it('should call setFunctionArguments with functionAgent.params and calledArguments', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.setFunctionArguments
        .calledWithExactly(functionAgent.params, calledArguments)
    ).to.be.true
  })

  it('should call parseNode with functionAgent body after all above settings done', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(functionAgent.body)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setFunctionEnvironment)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setFunctionContext)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setFunctionArguments)
    ).to.be.true
  })

  it('should call resetEnvironment with result from getEnvironment after parseNode', () => {
    const getEnvironmentStub = {
      scriptUrl: 'scriptUrl',
      closureStack: {}
    }
    esprimaParser.getEnvironment.returns(getEnvironmentStub)

    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.resetEnvironment
        .calledWithExactly(getEnvironmentStub)
    ).to.be.true
    expect(
      esprimaParser.resetEnvironment
        .calledAfter(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should return result from parseNode', () => {
    const parseNodeStub = 'resultFromParseNode'

    esprimaParser.parseNode.returns(parseNodeStub)

    const result = esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(result).to.be.equal(parseNodeStub)
  })
})
