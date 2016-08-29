describe('execute tests', () => {
  const data = ['data']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'executeExpression')
  })

  it('should call executeExpression with data', () => {
    esprimaParser.execute(data)

    expect(
      esprimaParser.executeExpression
        .calledWithExactly(data)
    ).to.be.true
  })

  it('should return result from executeExpression given no error threw', () => {
    esprimaParser.executeExpression
      .returns('resultFromExecuteExpression')

    const result = esprimaParser.execute(data)

    expect(result).to.be.equal('resultFromExecuteExpression')
  })

  it('should return undefined given error threw from executeExpression', () => {
    esprimaParser.executeExpression
      .throws(new Error('errorFromExecuteExpression'))

    const result = esprimaParser.execute(data)

    expect(result).to.be.undefined
  })
})
