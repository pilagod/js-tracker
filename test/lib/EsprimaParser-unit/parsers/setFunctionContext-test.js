describe('setFunctionContext tests', () => {
  const context = 'context'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call setVariables with \'this\' and context', () => {
    esprimaParser.setFunctionContext(context)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('this', context)
    ).to.be.true
  })
})
