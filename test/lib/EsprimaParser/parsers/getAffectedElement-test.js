describe('getAffectedElement tests', () => {
  const callee = 'callee'
  const expression = {
    arguments: ['arg1', 'arg2', 'arg3']
  }

  it('should return callee given status has no property passive', () => {
    const status = {}

    const result = esprimaParser.getAffectedElement(callee, expression, status)

    expect(result).to.be.equal(callee)
  })

  it('should return expression arguments indexed by status.passive given status has property passive', () => {
    const status = {
      passive: 1
    }
    const result = esprimaParser.getAffectedElement(callee, expression, status)

    expect(result).to.be.equal('arg2')
  })
})
