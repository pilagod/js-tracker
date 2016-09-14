describe('isNeededToSet tests', () => {
  const variables = 'variables'

  it('should return true given valid init', () => {
    const init = createAstNode('Expression')

    const result = esprimaParser.isNeededToSet(variables, init)

    expect(result).to.be.true
  })

  it('should return true given null init but latest closure has no variables', () => {
    const init = null

    sandbox.stub(esprimaParser, 'closureStack', {
      getLatestClosure: sandbox.stub().returns({
        exist: sandbox.stub()
          .withArgs(variables).returns(false)
      })
    })
    const result = esprimaParser.isNeededToSet(variables, init)

    expect(result).to.be.true
  })

  it('should return false given null init and latest closure has variables', () => {
    const init = null

    sandbox.stub(esprimaParser, 'closureStack', {
      getLatestClosure: sandbox.stub().returns({
        exist: sandbox.stub()
          .withArgs(variables).returns(true)
      })
    })
    const result = esprimaParser.isNeededToSet(variables, init)

    expect(result).to.be.false
  })
})
