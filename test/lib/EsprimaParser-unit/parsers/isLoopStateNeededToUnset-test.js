describe('isLoopStateNeededToUnset tests', () => {
  const label = 'label'
  let flowState

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'flowState', {
      isNullLabel: sandbox.stub(),
      isLabelMatched: sandbox.stub()
    })
    flowState = esprimaParser.flowState
  })

  it('should return true given isNullLabel returns true', () => {
    flowState.isNullLabel.returns(true)

    const result = esprimaParser.isLoopStateNeededToUnset(label)

    expect(result).to.be.true
  })

  it('should return true given isNullLabel returns false and isLabelMatched called with label returns true', () => {
    flowState.isNullLabel.returns(false)
    flowState.isLabelMatched.withArgs(label).returns(true)

    const result = esprimaParser.isLoopStateNeededToUnset(label)

    expect(result).to.be.true
  })

  it('should return false given isNullLabel and isLabelMatched called with label both returns false', () => {
    flowState.isNullLabel.returns(false)
    flowState.isLabelMatched.withArgs(label).returns(false)

    const result = esprimaParser.isLoopStateNeededToUnset(label)

    expect(result).to.be.false
  })
})
