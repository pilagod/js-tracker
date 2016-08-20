describe('addInfoToCollection tests', () => {
  const info = {
    code: 'code',
    loc: 'loc'
  }
  const callee = 'callee'
  const expression = 'expression'
  const status = {type: 'STATE'}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getAffectedElements')
      .returns('resultFromGetAffectedElements')
    sandbox.stub(esprimaParser, 'addInfoToElements')
  })

  it('should call getAffectedElements with callee, expression and status', () => {
    esprimaParser.addInfoToCollection(callee, expression, info, status)

    expect(
      esprimaParser.getAffectedElements
        .calledWithExactly(callee, expression, status)
    ).to.be.true
  })

  it('should call addInfoToElements with info, result from getAffectedElements and status', () => {
    esprimaParser.addInfoToCollection(callee, expression, info, status)

    expect(
      esprimaParser.addInfoToElements
        .calledWithExactly('resultFromGetAffectedElements', info, status)
    ).to.be.true
  })
})
