describe('getNextCallee tests', () => {
  const callee = 'callee'
  const expression = 'expression'

  it('should return status.execute given status has property execute', () => {
    const status = {
      execute: 'execute'
    }
    const result = esprimaParser.getNextCallee(callee, expression, status)

    expect(result).to.be.equal(status.execute)
  })

  it('should return result from execute called with an array containing callee and expression given status has no property execute', () => {
    const status = {}

    sandbox.stub(esprimaParser, 'execute')
      .returns('resultFromExecute')

    const result = esprimaParser.getNextCallee(callee, expression, status)

    expect(
      esprimaParser.execute
        .calledWithExactly([callee, expression])
    ).to.be.true
    expect(result).to.be.equal('resultFromExecute')
  })
})
