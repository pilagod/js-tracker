describe('getFunctionAgentParser tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser.parseFunctionAgent, 'bind')
      .returns('resultFromBoundParseFunctionAgent')
  })

  it('should return parseFunctionAgent bound with esprimaParser', () => {
    const result = esprimaParser.getFunctionAgentParser()

    expect(
      esprimaParser.parseFunctionAgent.bind
        .calledWithExactly(esprimaParser)
    ).to.be.true
    expect(result).to.be.equal('resultFromBoundParseFunctionAgent')
  })
})
