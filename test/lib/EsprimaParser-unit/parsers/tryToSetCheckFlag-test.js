describe('tryToSetCheckFlag tests', () => {
  const exp = {
    caller: {caller: 'caller'},
    callee: {callee: 'callee'},
    info: {info: 'info'}
  }
  let status

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'addInfoToCollection')
  })

  it('should return false given undefined status', () => {
    status = undefined

    const result = esprimaParser.tryToSetCheckFlag(exp, status)

    expect(result).to.be.false
  })

  it('should set checkFlag to true given valid status', () => {
    status = {}

    esprimaParser.tryToSetCheckFlag(exp, status)

    expect(esprimaParser.checkFlag).to.be.true
  })

  it('should call addInfoToCollection with exp and status given valid status', () => {
    status = {}

    esprimaParser.tryToSetCheckFlag(exp, status)

    expect(
      esprimaParser.addInfoToCollection
        .calledWithExactly(exp, status)
    ).to.be.true
  })

  it('should return true given valid status', () => {
    status = {}

    const result = esprimaParser.tryToSetCheckFlag(exp, status)

    expect(result).to.be.true
  })
})
