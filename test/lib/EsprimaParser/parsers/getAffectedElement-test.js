describe('getAffectedElement tests', () => {
  const callee = 'callee'
  const expression = {
    arguments: ['arg1', 'arg2', 'arg3']
  }

  it('should return expression arguments indexed by status.passive given status has property passive', () => {
    const status = {
      passive: 1
    }
    const result = esprimaParser.getAffectedElement(callee, expression, status)

    expect(result).to.be.equal('arg2')
  })

  it('should call getElement with callee and return', () => {
    const status = {}

    sandbox.stub(esprimaParser, 'getElementFrom')
      .returns('resultFromGetElementFrom')

    const result = esprimaParser.getAffectedElement(callee, expression, status)

    expect(
      esprimaParser.getElementFrom
        .calledWithExactly(callee)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetElementFrom')
  })
})
