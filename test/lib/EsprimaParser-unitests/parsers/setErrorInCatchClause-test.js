describe('setErrorInCatchClause tests', () => {
  const error = new Error('error from block')
  let param

  beforeEach(() => {
    param = createAstNode('Pattern')

    sandbox.stub(esprimaParser, 'getNameFromPattern')
      .returns('resultFromGetNameFromPattern')
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call getNameFromPattern with param', () => {
    esprimaParser.setErrorInCatchClause(param, error)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(param)
    ).to.be.true
  })

  it('should call setVariables with result from getNameFromPattern and error', () => {
    esprimaParser.setErrorInCatchClause(param, error)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('resultFromGetNameFromPattern', error)
    ).to.be.true
  })
})
