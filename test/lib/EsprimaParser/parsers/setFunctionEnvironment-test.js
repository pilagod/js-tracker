describe('setFunctionEnvironment tests', () => {
  let functionAgent, getStackStub

  beforeEach(() => {
    getStackStub = {
      createClosure: sandbox.stub()
    }
    functionAgent = {
      scriptUrl: 'functionAgentScriptUrl',
      closureStack: {
        getStack: sandbox.stub().returns(getStackStub)
      }
    }
  })

  it('should set esprimaParser scriptUrl to functionAgent\'s', () => {
    esprimaParser.setFunctionEnvironment(functionAgent)

    expect(esprimaParser.scriptUrl).to.be.equal(functionAgent.scriptUrl)
  })

  it('should set esprimaParser closureStack to copy of functionAgent\'s', () => {
    esprimaParser.setFunctionEnvironment(functionAgent)

    expect(functionAgent.closureStack.getStack.called).to.be.true
    expect(esprimaParser.closureStack).to.be.equal(getStackStub)
  })

  it('should call createClosure of the copy from functionAgent\'s closureStack', () => {
    esprimaParser.setFunctionEnvironment(functionAgent)

    expect(getStackStub.createClosure.called).to.be.true
  })
})
