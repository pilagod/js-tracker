describe('getLoopStatus tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'flowStatus', {
      isLoopBreakStatus: sandbox.stub(),
      isLoopContinueStatus: sandbox.stub()
    })
  })

  it('should return break given isLoopBreakStatus return true', () => {
    esprimaParser.flowStatus.isLoopBreakStatus.returns(true)

    const result = esprimaParser.getLoopStatus()

    expect(result).to.be.equal('break')
  })

  it('should return continue given isLoopContinueStatus return true', () => {
    esprimaParser.flowStatus.isLoopContinueStatus.returns(true)

    const result = esprimaParser.getLoopStatus()

    expect(result).to.be.equal('continue')
  })

  it('should return undefined given isLoopBreakStatus and isLoopContinueStatus both return not true', () => {
    const result = esprimaParser.getLoopStatus()

    expect(result).to.be.undefined
  })
})
