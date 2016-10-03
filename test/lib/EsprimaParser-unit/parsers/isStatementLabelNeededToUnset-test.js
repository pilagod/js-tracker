describe('isStatementLabelNeededToUnset tests', () => {
  const label = 'label'
  let flowState

  beforeEach(() => {
    sandbox.stub(esprimaParser.flowState)

    flowState = esprimaParser.flowState
  })

  it('should return true if flowState.isNullLabel returns false and flowState.isLabelMatched called with label retunrs true', () => {
    flowState.isNullLabel.returns(false)
    flowState.isLabelMatched.withArgs(label).returns(true)

    const result = esprimaParser.isStatementLabelNeededToUnset(label)

    expect(result).to.be.true
  })

  it('should return false if flowState.isNullLabel returns true', () => {
    flowState.isNullLabel.returns(true)

    const result = esprimaParser.isStatementLabelNeededToUnset(label)

    expect(result).to.be.false
  })

  it('should return false if flowState.isNullLabel returns false but flowState.isLabelMatched called with label returns false', () => {
    flowState.isNullLabel.returns(false)
    flowState.isLabelMatched.withArgs(label).returns(false)

    const result = esprimaParser.isStatementLabelNeededToUnset(label)

    expect(result).to.be.false
  })
})
