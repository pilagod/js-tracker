describe('parseFunctionAgentData tests', () => {
  const functionAgentData = {
    body: 'body',
    params: ['param1', 'param2', 'param3'],
    hoistings: ['var1', 'var2', 'var3']
  }
  const builtInArguments = {
    this: {},
    arguments: {}
  }
  const calledArguments = ['arg1', 'arg2', 'arg3']
  // stub results
  const envGlobal = 'envGlobal'
  const envFunction = 'envFunction'
  let FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getEnvironment')
      .withArgs(esprimaParser).returns(envGlobal)
      .withArgs(functionAgentData).returns(envFunction)
    sandbox.stub(esprimaParser, 'setEnvironment')
    sandbox.stub(esprimaParser, 'closureStack', {
      createClosure: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'setHoistings')
    sandbox.stub(esprimaParser, 'setBuiltInArguments')
    sandbox.stub(esprimaParser, 'setCalledArguments')
    // sandbox.stub(esprimaParser, 'setFunctionClosure')
    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'flowState', {
      unset: sandbox.spy()
    })
  })

  it('should call getEnvironment with esprimaParser', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(esprimaParser)
    ).to.be.true
  })

  it('should call getEnvironment with functionAgentData', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(functionAgentData)
    ).to.be.true
  })

  it('should call setEnvironment with esprimaParser and envFunction after getEnvironment called with esprimaParser', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, envFunction)
    ).to.be.true
    expect(
      esprimaParser.setEnvironment
        .withArgs(esprimaParser, envFunction)
          .calledAfter(esprimaParser.getEnvironment.withArgs(esprimaParser))
    ).to.be.true
  })

  it('should call closureStack.createClosure after setEnvironment called with esprimaParser and envFunction', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(esprimaParser.closureStack.createClosure.called).to.be.true
    expect(
      esprimaParser.closureStack.createClosure
        .calledAfter(
          esprimaParser.setEnvironment
            .withArgs(esprimaParser, envFunction)
        )
    ).to.be.true
  })

  it('should call setHoistings with functionAgentData.hoistings after createClosure', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.setHoistings
        .calledWithExactly(functionAgentData.hoistings)
    ).to.be.true
    expect(
      esprimaParser.setHoistings
        .calledAfter(esprimaParser.closureStack.createClosure)
    ).to.be.true
  })

  it('should call setBuiltInArguments with builtInArguments after setHoistings', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.setBuiltInArguments
        .calledWithExactly(builtInArguments)
    ).to.be.true
    expect(
      esprimaParser.setBuiltInArguments
        .calledAfter(esprimaParser.setHoistings)
    ).to.be.true
  })

  it('should call setCalledArguments with functionAgentData.parans and calledArguments after setHoistings', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.setCalledArguments
        .calledWithExactly(functionAgentData.params, calledArguments)
    ).to.be.true
    expect(
      esprimaParser.setCalledArguments
        .calledAfter(esprimaParser.setHoistings)
    ).to.be.true
  })

  it('should call parseNode with functionAgentData body after setBuiltInArguments and setCalledArguments', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(functionAgentData.body)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setBuiltInArguments)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setCalledArguments)
    ).to.be.true
  })

  it('should call setEnvironment with esprimaParser and envGlobalw after parseNode called', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, envGlobal)
    ).to.be.true
    expect(
      esprimaParser.setEnvironment
        .withArgs(esprimaParser, envGlobal)
          .calledAfter(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should call unset of flowState with FlowState.RETURN after parseNode called', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

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

    const result = esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(result).to.be.equal(resultFromParseNode)
  })

  it('should call setEnvironment with esprimaParser and globalEnvironment given parseNode called with functionAgentData.body throw error', () => {
    const error = new Error()

    esprimaParser.parseNode.throws(error)

    try {
      esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)
    } catch (e) {
      expect(e).to.be.equal(error)
    }
    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, envGlobal)
    ).to.be.true
  })
})
