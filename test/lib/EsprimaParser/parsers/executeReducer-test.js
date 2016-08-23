describe('executeReducer tests', () => {
  const pre = 'pre'
  const callee = 'callee'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'CalleeAgent', function () {})
  })

  it('should call executeCall with pre and cur given cur is instance of CalleeAgent and return', () => {
    const cur = new (esprimaParser.CalleeAgent)(callee)

    sandbox.stub(esprimaParser, 'executeCall')
      .returns('resultFromExecuteCall')

    const result = esprimaParser.executeReducer(pre, cur)

    expect(
      esprimaParser.executeCall
        .calledWithExactly(pre, cur)
    ).to.be.true
    expect(result).to.be.equal('resultFromExecuteCall')
  })

  it('should call executeMember with pre and cur given cur is not instance of CalleeAgent and return', () => {
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
