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

  it('should call getAffectedElement with callee, expression and status given valid status', () => {
    esprimaParser.addInfoToCollection(callee, expression, status, info)

    expect(
      esprimaParser.getAffectedElement
        .calledWithExactly(callee, expression, status)
    ).to.be.true
  })

  it('should call addInfoToElement with info, result from getAffectedElement and status given valid status', () => {
    esprimaParser.addInfoToCollection(callee, expression, status, info)

    expect(
      esprimaParser.addInfoToElement
        .calledWithExactly('resultFromGetAffectedElement', status, info)
    ).to.be.true
  })

  it('should not call getAffectedElement and addInfoToElement given undefined status', () => {
    esprimaParser.addInfoToCollection(callee, expression, undefined, info)

    expect(esprimaParser.getAffectedElement.called).to.be.false
    expect(esprimaParser.addInfoToElement.called).to.be.false
  })
})
