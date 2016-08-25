describe('executeReducer tests', () => {
  const pre = 'pre'
  const method = 'method'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'Callee', function () {})
  })

  it('should call executeCall with pre and cur given cur is instance of Callee and return', () => {
    const cur = new (esprimaParser.Callee)(method)

    sandbox.stub(esprimaParser, 'executeCall')
      .returns('resultFromExecuteCall')

    const result = esprimaParser.executeReducer(pre, cur)

    expect(
      esprimaParser.executeCall
        .calledWithExactly(pre, cur)
    ).to.be.true
    expect(result).to.be.equal('resultFromExecuteCall')
  })

  it('should call executeMember with pre and cur given cur is not instance of Callee and return', () => {
    const cur = 'cur'

    sandbox.stub(esprimaParser, 'executeMember')
      .returns('resultFromExecuteMember')

    const result = esprimaParser.executeReducer(pre, cur)

    expect(
      esprimaParser.executeMember
        .calledWithExactly(pre, cur)
    ).to.be.true
    expect(result).to.be.equal('resultFromExecuteMember')
  })
})
