describe('getLoopState tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'flowState', {
      isLoopBreakState: sandbox.stub(),
      isLoopContinueState: sandbox.stub()
    })
  })

  it('should return break given isLoopBreakState return true', () => {
    esprimaParser.flowState.isLoopBreakState.returns(true)

    const result = esprimaParser.getLoopState()

    expect(result).to.be.equal('break')
  })

  it('should return continue given isLoopContinueState return true', () => {
    esprimaParser.flowState.isLoopContinueState.returns(true)

    const result = esprimaParser.getLoopState()

    expect(result).to.be.equal('continue')
  })

  it('should return undefined given isLoopBreakState and isLoopContinueState both return not true', () => {
    const result = esprimaParser.getLoopState()

    expect(result).to.be.undefined
  })
})
