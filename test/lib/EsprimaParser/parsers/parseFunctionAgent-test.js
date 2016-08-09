describe('parseFunctionAgent tests', () => {
  const functionAgent = {
    body: 'body',
    params: 'params'
  }
  const context = 'context'
  const calledArguments = ['arg1', 'arg2', 'arg3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getEnvironment')
      .withArgs(esprimaParser).returns('globalEnvironment')
      .withArgs(functionAgent).returns('functionEnvironment')
    sandbox.stub(esprimaParser, 'setEnvironment')
    sandbox.stub(esprimaParser, 'setFunctionClosure')
    sandbox.stub(esprimaParser, 'parseNode')
  })

  it('should call getEnvironment with esprimaParser', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(esprimaParser)
    ).to.be.true
  })

  it('should call getEnvironment with functionAgent', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(functionAgent)
    ).to.be.true
  })

  it('should call setEnvironment with esprimaParser and function environment after getEnvironment with esprimaParser', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, 'functionEnvironment')
    ).to.be.true
    expect(
      esprimaParser.setEnvironment
        .withArgs(esprimaParser, 'functionEnvironment')
          .calledAfter(esprimaParser.getEnvironment.withArgs(esprimaParser))
    ).to.be.true
  })

  it('should call setFunctionClosure with context and an object of keys (params) and values (calledArguments) after setEnvironment with function environment', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.setFunctionClosure
        .calledWithExactly(context, {
          keys: functionAgent.params,
          values: calledArguments
        })
    ).to.be.true
    expect(
      esprimaParser.setFunctionClosure
        .calledAfter(esprimaParser.setEnvironment.withArgs(esprimaParser, 'functionEnvironment'))
    ).to.be.true
  })

  it('should call parseNode with functionAgent body after setFunctionClosure', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(functionAgent.body)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setFunctionClosure)
    ).to.be.true
  })

  it('should call setEnvironment with esprimaParser and globalEnvironment after parseNode', () => {
    esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, 'globalEnvironment')
    ).to.be.true
    expect(
      esprimaParser.setEnvironment
        .withArgs(esprimaParser, 'globalEnvironment')
          .calledAfter(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should return result from parseNode', () => {
    esprimaParser.parseNode.returns('resultFromParseNode')

    const result = esprimaParser.parseFunctionAgent(functionAgent, context, calledArguments)

    expect(result).to.be.equal('resultFromParseNode')
  })
})
