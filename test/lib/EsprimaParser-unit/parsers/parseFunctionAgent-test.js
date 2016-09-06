describe('parseFunctionAgent tests', () => {
  const functionAgent = {
    body: 'body',
    params: 'params'
  }
  const builtInArguments = {
    this: {},
    arguments: {}
  }
  const calledArguments = ['arg1', 'arg2', 'arg3']
  // stub results
  const globalEnvironment = 'globalEnvironment'
  const functionEnvironment = 'functionEnvironment'
  let FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getEnvironment')
      .withArgs(esprimaParser).returns(globalEnvironment)
      .withArgs(functionAgent).returns(functionEnvironment)
    sandbox.stub(esprimaParser, 'setEnvironment')
    sandbox.stub(esprimaParser, 'setFunctionClosure')
    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'flowState', {
      unset: sandbox.stub()
    })
  })

  it('should call getEnvironment with esprimaParser', () => {
    esprimaParser.parseFunctionAgent(functionAgent, builtInArguments, calledArguments)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(esprimaParser)
    ).to.be.true
  })

  it('should call getEnvironment with functionAgent', () => {
    esprimaParser.parseFunctionAgent(functionAgent, builtInArguments, calledArguments)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(functionAgent)
    ).to.be.true
  })

  it('should call setEnvironment with esprimaParser and function environment after getEnvironment with esprimaParser', () => {
    esprimaParser.parseFunctionAgent(functionAgent, builtInArguments, calledArguments)

    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, functionEnvironment)
    ).to.be.true
    expect(
      esprimaParser.setEnvironment
        .withArgs(esprimaParser, functionEnvironment)
          .calledAfter(esprimaParser.getEnvironment.withArgs(esprimaParser))
    ).to.be.true
  })

  it('should call setFunctionClosure with context and an object of keys (params) and values (calledArguments) after setEnvironment called with function environment', () => {
    esprimaParser.parseFunctionAgent(functionAgent, builtInArguments, calledArguments)

    expect(
      esprimaParser.setFunctionClosure
        .calledWithExactly(builtInArguments, {
          keys: functionAgent.params,
          values: calledArguments
        })
    ).to.be.true
    expect(
      esprimaParser.setFunctionClosure
        .calledAfter(esprimaParser.setEnvironment.withArgs(esprimaParser, functionEnvironment))
    ).to.be.true
  })

  it('should call parseNode with functionAgent body after setFunctionClosure called', () => {
    esprimaParser.parseFunctionAgent(functionAgent, builtInArguments, calledArguments)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(functionAgent.body)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setFunctionClosure)
    ).to.be.true
  })

  it('should call setEnvironment with esprimaParser and globalEnvironment after parseNode called', () => {
    esprimaParser.parseFunctionAgent(functionAgent, builtInArguments, calledArguments)

    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, globalEnvironment)
    ).to.be.true
    expect(
      esprimaParser.setEnvironment
        .withArgs(esprimaParser, globalEnvironment)
          .calledAfter(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should call unset of flowState with FlowState.RETURN after parseNode called', () => {
    esprimaParser.parseFunctionAgent(functionAgent, builtInArguments, calledArguments)

    expect(
      esprimaParser.flowState.unset
        .calledWithExactly(FlowState.RETURN)
    ).to.be.true
    expect(
      esprimaParser.flowState.unset
        .calledAfter(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should return result from parseNode', () => {
    const resultFromParseNode = 'resultFromParseNode'

    esprimaParser.parseNode.returns(resultFromParseNode)

    const result = esprimaParser.parseFunctionAgent(functionAgent, builtInArguments, calledArguments)

    expect(result).to.be.equal(resultFromParseNode)
  })
})
