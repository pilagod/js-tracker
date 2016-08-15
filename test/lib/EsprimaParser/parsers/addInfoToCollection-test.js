describe('addInfoToCollection tests', () => {
  const info = {
    code: 'code',
    loc: 'loc'
  }
  const callee = 'callee'
  const expression = 'expression'
  const status = {
    type: 'STATE'
  }
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getAffectedElement')
      .returns('resultFromGetAffectedElement')
    sandbox.stub(esprimaParser, 'addInfoToElement')
  })

  it('should call getAffectedElement with callee, expression and status', () => {
    esprimaParser.addInfoToCollection(callee, expression, status, info)

    expect(
      esprimaParser.getAffectedElement
        .calledWithExactly(callee, expression, status)
    ).to.be.true
  })

  it('should call addInfoToElement with info, result from getAffectedElement and status', () => {
    esprimaParser.addInfoToCollection(callee, expression, status, info)

    expect(
      esprimaParser.addInfoToElement
        .calledWithExactly('resultFromGetAffectedElement', status, info)
    ).to.be.true
  })
})
