describe('executeExp tests', () => {
  const exp = {
    caller: {}
  }
  // stub results
  const CalleeStub = function () {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'Callee', CalleeStub)
  })

  it('should call executeCall with exp and return given exp.callee is instance of Callee', () => {
    const resultFromExecuteCall = 'resultFromExecuteCall'

    exp.callee = new (esprimaParser.Callee)('callee')

    sandbox.stub(esprimaParser, 'executeCall')
      .returns(resultFromExecuteCall)

    const result = esprimaParser.executeExp(exp)

    expect(
      esprimaParser.executeCall
        .calledWithExactly(exp)
    ).to.be.true
    expect(result).to.be.equal(resultFromExecuteCall)
  })

  it('should call executeMember with exp and return given exp.callee is not instance of Callee', () => {
    const resultFromExecuteMember = 'resultFromExecuteMember'

    exp.callee = 'callee'

    sandbox.stub(esprimaParser, 'executeMember')
      .returns(resultFromExecuteMember)

    const result = esprimaParser.executeExp(exp)

    expect(
      esprimaParser.executeMember
        .calledWithExactly(exp)
    ).to.be.true
    expect(result).to.be.equal(resultFromExecuteMember)
  })
})
