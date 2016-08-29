describe('setVariables tests', () => {
  let variables, values

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'closureStack', {
      set: sandbox.spy()
    })
  })

  it('should call set of closureStack with variables and values', () => {
    variables = 'variables'
    values = 'values'

    esprimaParser.setVariables(variables, values)

    expect(
      esprimaParser.closureStack.set
        .calledWithExactly(variables, values)
    ).to.be.true
  })
})
