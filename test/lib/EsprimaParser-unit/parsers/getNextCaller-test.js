describe('getNextCaller tests', () => {
  const target = {
    caller: {},
    callee: {}
  }
  // stub results
  const resultFromExecute = 'resultFromExecute'

  it('should return status.execute given valid status and it has property execute', () => {
    const status = {
      execute: 'execute'
    }
    const result = esprimaParser.getNextCaller(target, status)

    expect(result).to.be.equal(status.execute)
  })

  it('should return result from execute called with an array of caller and callee given undefined status', () => {
    const status = undefined

    sandbox.stub(esprimaParser, 'execute')
      .returns(resultFromExecute)

    const result = esprimaParser.getNextCaller(target, status)

    expect(
      esprimaParser.execute
        .calledWithExactly([target.caller, target.callee])
    ).to.be.true
    expect(result).to.be.equal(resultFromExecute)
  })

  it('should return result from execute called with an array containing caller and callee given valid status but it has no property execute', () => {
    const status = {}

    sandbox.stub(esprimaParser, 'execute')
      .returns(resultFromExecute)

    const result = esprimaParser.getNextCaller(target, status)

    expect(
      esprimaParser.execute
        .calledWithExactly([target.caller, target.callee])
    ).to.be.true
    expect(result).to.be.equal(resultFromExecute)
  })
})
