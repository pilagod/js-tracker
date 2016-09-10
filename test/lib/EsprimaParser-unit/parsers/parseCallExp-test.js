describe('parseCallExp tests', () => {
  const exp = {
    caller: {caller: 'caller'},
    callee: {callee: 'callee'},
    info: {info: 'info'}
  }
  const success = 'Boolean'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setCheckFlag').returns(success)
    sandbox.stub(esprimaParser, 'execute').returns('resultFromExecute')
    sandbox.stub(esprimaParser, 'resetCheckFlag')
  })

  it('should call setCheckFlag with exp', () => {
    esprimaParser.parseCallExp(exp)

    expect(
      esprimaParser.setCheckFlag
        .calledWithExactly(exp)
    ).to.be.true
  })

  it('should call execute with exp after setCheckFlag', () => {
    esprimaParser.parseCallExp(exp)

    expect(
      esprimaParser.execute
        .calledAfter(esprimaParser.setCheckFlag)
    ).to.be.true
    expect(
      esprimaParser.execute
        .calledWithExactly(exp)
    ).to.be.true
  })

  it('should call resetCheckFlag with success (from setCheckFlag) after execute', () => {
    esprimaParser.parseCallExp(exp)

    expect(
      esprimaParser.resetCheckFlag
        .calledAfter(esprimaParser.execute)
    ).to.be.true
    expect(
      esprimaParser.resetCheckFlag
        .calledWithExactly(success)
    ).to.be.true
  })

  it('should return result from execute', () => {
    const result = esprimaParser.parseCallExp(exp)

    expect(result).to.be.equal('resultFromExecute')
  })
})
