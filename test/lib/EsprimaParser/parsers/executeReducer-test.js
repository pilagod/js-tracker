describe('executeReducer tests', () => {
  const pre = 'pre'
  const method = 'method'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'Method', function () {})
  })

  it('should call executeCall with pre and cur given cur is instance of Method', () => {
    const cur = new (esprimaParser.Method)(method)

    sandbox.stub(esprimaParser, 'executeCall')

    esprimaParser.executeReducer(pre, cur)

    expect(
      esprimaParser.executeCall
        .calledWithExactly(pre, cur)
    ).to.be.true
  })

  it('should call executeMember with pre and cur given cur is not instance of Method', () => {
    const cur = 'cur'

    sandbox.stub(esprimaParser, 'executeMember')

    esprimaParser.executeReducer(pre, cur)

    expect(
      esprimaParser.executeMember
        .calledWithExactly(pre, cur)
    ).to.be.true
  })
})
