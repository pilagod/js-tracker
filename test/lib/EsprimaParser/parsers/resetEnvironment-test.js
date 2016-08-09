describe('resetEnvironment tests', () => {
  const environment = {
    scriptUrl: 'scriptUrl',
    closureStack: 'closureStack'
  }
  let popClosureStub

  beforeEach(() => {
    popClosureStub = sandbox.stub()

    sandbox.stub(esprimaParser, 'closureStack', {
      popClosure: popClosureStub
    })
  })

  it('should call popClosure of esprimaParser', () => {
    esprimaParser.resetEnvironment(environment)

    expect(popClosureStub.called).to.be.true
  })

  it('should set esprimaParser scriptUrl and closureStack to given environment after calling popClosure', () => {
    esprimaParser.resetEnvironment(environment)

    expect(esprimaParser.scriptUrl).to.be.equal(environment.scriptUrl)
    expect(esprimaParser.closureStack).to.be.equal(environment.closureStack)
  })
})
