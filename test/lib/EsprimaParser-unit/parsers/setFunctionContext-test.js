describe('setFunctionContext tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call setVariables with \'this\' and esprimaParser.context given undefined context', () => {
    sandbox.stub(esprimaParser, 'context', {})

    esprimaParser.setFunctionContext(undefined)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('this', esprimaParser.context)
    ).to.be.true
  })

  it('should call setVariables with \'this\' and context', () => {
    const context = {}

    esprimaParser.setFunctionContext(context)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('this', context)
    ).to.be.true
  })
})
