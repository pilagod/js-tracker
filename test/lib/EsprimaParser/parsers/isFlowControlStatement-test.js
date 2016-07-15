describe('isFlowControlStatement', () => {
  it('should return true given type ReturnStatement', () => {
    const result = esprimaParser.isFlowControlStatement('ReturnStatement')

    expect(result).to.be.true
  })

  it('should return true given type ContinueStatement', () => {
    const result = esprimaParser.isFlowControlStatement('ContinueStatement')

    expect(result).to.be.true
  })

  it('should return true given type BreakStatement', () => {
    const result = esprimaParser.isFlowControlStatement('BreakStatement')

    expect(result).to.be.true
  })

  it('should return false given other type than flow control statement', () => {
    const result = esprimaParser.isFlowControlStatement('NotFlowControlStatement')

    expect(result).to.be.false
  })
})
