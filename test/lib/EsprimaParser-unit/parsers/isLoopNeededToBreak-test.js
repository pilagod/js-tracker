describe('isLoopNeededToBreak tests', () => {
  const label = 'label'
  const resultFromLoopBreakState = true
  const resultFromLoopContinueState = true
  let flowState

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'flowState', {
      isReturnState: sandbox.stub(),
      isBreakState: sandbox.stub(),
      isContinueState: sandbox.stub(),
    })
    sandbox.stub(esprimaParser, 'handleLoopBreakState')
      .withArgs(label).returns(resultFromLoopBreakState)
    sandbox.stub(esprimaParser, 'handleLoopContinueState')
      .withArgs(label).returns(resultFromLoopContinueState)

    flowState = esprimaParser.flowState
  })

  it('should call isReturnState very first', () => {
    esprimaParser.isLoopNeededToBreak()

    expect(
      flowState.isReturnState
        .calledBefore(flowState.isBreakState)
    ).to.be.true
    expect(
      flowState.isReturnState
        .calledBefore(flowState.isContinueState)
    ).to.be.true
  })

  it('should always return true given isReturnState returns true', () => {
    flowState.isReturnState.returns(true)

    const result = esprimaParser.isLoopNeededToBreak()

    expect(result).to.be.true
  })

  it('should return result from handleLoopBreakState called with label if isBreakState returns true', () => {
    flowState.isBreakState.returns(true)

    const result = esprimaParser.isLoopNeededToBreak(label)

    expect(
      esprimaParser.handleLoopBreakState
        .calledWithExactly(label)
    ).to.be.true
    expect(result).to.be.equal(resultFromLoopBreakState)
  })

  it('should return result from handleLoopBreakState called with label if isBreakState returns true', () => {
    flowState.isContinueState.returns(true)

    const result = esprimaParser.isLoopNeededToBreak(label)

    expect(
      esprimaParser.handleLoopContinueState
        .calledWithExactly(label)
    ).to.be.true
    expect(result).to.be.equal(resultFromLoopContinueState)
  })

  it('should return false given isReturnState, isBreakState and isContinueState all returns false', () => {
    flowState.isReturnState.returns(false)
    flowState.isBreakState.returns(false)
    flowState.isContinueState.returns(false)

    const result = esprimaParser.isLoopNeededToBreak()

    expect(result).to.be.false
  })
})
