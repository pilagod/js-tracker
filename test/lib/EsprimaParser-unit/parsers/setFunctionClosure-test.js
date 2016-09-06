describe('setFunctionClosure tests', () => {
  const builtInArguments = {
    this: {},
    arguments: {}
  }
  const calledArguments = {
    keys: 'keys',
    values: 'values'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'closureStack', {
      createClosure: sandbox.stub()
    })
    sandbox.stub(esprimaParser, 'setBuiltInArguments')
    sandbox.stub(esprimaParser, 'setCalledArguments')
  })

  it('should call createClosure of closureStack', () => {
    esprimaParser.setFunctionClosure(builtInArguments, calledArguments)

    expect(esprimaParser.closureStack.createClosure.called).to.be.true
  })

  it('should call setBuiltInArguments with builtInArguments after createClosure', () => {
    esprimaParser.setFunctionClosure(builtInArguments, calledArguments)

    expect(
      esprimaParser.setBuiltInArguments
        .calledWithExactly(builtInArguments)
    ).to.be.true
    expect(
      esprimaParser.setBuiltInArguments
        .calledAfter(esprimaParser.closureStack.createClosure)
    ).to.be.true
  })

  it('should call setCalledArguments with params after createClosure', () => {
    esprimaParser.setFunctionClosure(builtInArguments, calledArguments)

    expect(
      esprimaParser.setCalledArguments
        .calledWithExactly(calledArguments)
    ).to.be.true
    expect(
      esprimaParser.setCalledArguments
        .calledAfter(esprimaParser.closureStack.createClosure)
    ).to.be.true
  })
})
