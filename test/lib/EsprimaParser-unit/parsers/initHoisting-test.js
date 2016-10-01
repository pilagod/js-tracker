describe('initHoisting tests', () => {
  const variables = 'variables'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call setVariables with variables and undefined', () => {
    esprimaParser.initHoisting(variables)

    expect(
      esprimaParser.setVariables
        .calledWithExactly(variables, undefined)
    ).to.be.true
  })
})
