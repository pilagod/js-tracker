describe('wrapFunctionAgentWithFunction tests', () => {
  const functionAgent = {}
  const calledArguments = [1, 2, 3, 4]

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseFunctionAgent')
      .returns('resultFromParseFunctionAgent')
  })

  it('should return a function', () => {
    const wrappedFunctionAgent =
      esprimaParser.wrapFunctionAgentWithFunction(functionAgent)

    expect(wrappedFunctionAgent).to.be.instanceof(Function)
  })

  it('should return a function call parseFunctionAgent with functionAgent, context and arguments and return (basic call test)', () => {
    const wrappedFunctionAgent =
      esprimaParser.wrapFunctionAgentWithFunction(functionAgent)
    const result = wrappedFunctionAgent(...calledArguments)

    expect(
      esprimaParser.parseFunctionAgent
        .calledWithExactly(functionAgent, undefined, calledArguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseFunctionAgent')
  })

  it('should return a function call parseFunctionAgent with functionAgent, context and arguments and return (bind test)', () => {
    const contextStub = {}

    const wrappedFunctionAgent =
      esprimaParser.wrapFunctionAgentWithFunction(functionAgent)
    const result = wrappedFunctionAgent.bind(contextStub)(...calledArguments)

    expect(
      esprimaParser.parseFunctionAgent
        .calledWithExactly(functionAgent, contextStub, calledArguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseFunctionAgent')
  })

  it('should return a function call parseFunctionAgent with functionAgent, context and arguments and return (call test)', () => {
    const contextStub = {}

    const wrappedFunctionAgent =
      esprimaParser.wrapFunctionAgentWithFunction(functionAgent)
    const result = wrappedFunctionAgent.call(contextStub, ...calledArguments)

    expect(
      esprimaParser.parseFunctionAgent
        .calledWithExactly(functionAgent, contextStub, calledArguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseFunctionAgent')
  })

  it('should return a function call parseFunctionAgent with functionAgent, context and arguments and return (apply test)', () => {
    const contextStub = {}

    const wrappedFunctionAgent =
      esprimaParser.wrapFunctionAgentWithFunction(functionAgent)
    const result = wrappedFunctionAgent.apply(contextStub, calledArguments)

    expect(
      esprimaParser.parseFunctionAgent
        .calledWithExactly(functionAgent, contextStub, calledArguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseFunctionAgent')
  })
})
