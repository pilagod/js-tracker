describe('isVariableNeededToSet tests', () => {
  it('should return false given kind is var and init is null', () => {
    const kind = 'var'
    const init = null

    const result = esprimaParser.isVariableNeededToSet(kind, init)

    expect(result).to.be.false
  })

  it('should return true given kind is var but init is not null', () => {
    const kind = 'var'
    const init = createAstNode('Expression')

    const result = esprimaParser.isVariableNeededToSet(kind, init)

    expect(result).to.be.true
  })

  it('should return true given kind is let / const', () => {
    const results = []
    const init = null
    let kind

    kind = 'let'
    results.push(esprimaParser.isVariableNeededToSet(kind, init))

    kind = 'const'
    results.push(esprimaParser.isVariableNeededToSet(kind, init))

    expect(results).to.be.eql([true, true])
  })
})
