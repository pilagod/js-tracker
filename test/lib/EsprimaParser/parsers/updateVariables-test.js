describe('updateVariables tests', () => {
  let variables, values

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'closureStack', {
      update: sandbox.spy()
    })
  })

  it('should call update of closureStack with varaibles and values', () => {
    variables = 'variables'
    values = 'values'

    esprimaParser.updateVariables(variables, values)

    expect(
      esprimaParser.closureStack.update
        .calledWithExactly(variables, values)
    ).to.be.true
  })
})
