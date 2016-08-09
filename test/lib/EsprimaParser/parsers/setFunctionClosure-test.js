describe('setFunctionClosure tests', () => {
  const context = 'context'
  const params = {
    keys: 'keys',
    values: 'values'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'closureStack', {
      createClosure: sandbox.stub()
    })
    sandbox.stub(esprimaParser, 'setFunctionContext')
    sandbox.stub(esprimaParser, 'setFunctionArguments')
  })

  it('should call createClosure of closureStack', () => {
    esprimaParser.setFunctionClosure(context, params)

    expect(esprimaParser.closureStack.createClosure.called).to.be.true
  })

  it('should call setFunctionContext with context after createClosure', () => {
    esprimaParser.setFunctionClosure(context, params)

    expect(
      esprimaParser.setFunctionContext
        .calledWithExactly(context)
    ).to.be.true
    expect(
      esprimaParser.setFunctionContext
        .calledAfter(esprimaParser.closureStack.createClosure)
    ).to.be.true
  })

  it('should call setFunctionArguments with params after createClosure', () => {
    esprimaParser.setFunctionClosure(context, params)

    expect(
      esprimaParser.setFunctionArguments
        .calledWithExactly(params)
    ).to.be.true
    expect(
      esprimaParser.setFunctionArguments
        .calledAfter(esprimaParser.closureStack.createClosure)
    ).to.be.true
  })
})
