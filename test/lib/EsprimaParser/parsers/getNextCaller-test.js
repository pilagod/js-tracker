describe('getNextCaller tests', () => {
  const caller = 'caller'
  const callee = 'callee'

  it('should return status.execute given status has property execute', () => {
    const status = {
      execute: 'execute'
    }
    const result = esprimaParser.getNextCaller(caller, callee, status)

    expect(result).to.be.equal(status.execute)
  })

  it('should return result from execute called with an array containing caller and callee given status has no property execute', () => {
    const status = {}

    sandbox.stub(esprimaParser, 'execute')
      .returns('resultFromExecute')

    const result = esprimaParser.getNextCaller(caller, callee, status)

    expect(
      esprimaParser.execute
        .calledWithExactly([caller, callee])
    ).to.be.true
    expect(result).to.be.equal('resultFromExecute')
  })
})
