describe('getLoopStatusAndReset tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'status', {
      unset: sandbox.spy(),
      isLoopBreakStatus: sandbox.stub(),
      isLoopContinueStatus: sandbox.stub()
    })
  })

  it('should call unset of status with \'break\' and return \'break\' given isLoopBreakStatus returns true', () => {
    esprimaParser.status.isLoopBreakStatus.returns(true)

    const result = esprimaParser.getLoopStatusAndReset()

    expect(
      esprimaParser.status.unset
        .calledWithExactly('break')
    ).to.be.true
    expect(result).to.be.equal('break')
  })

  it('should call unset of status with \'continue\' and return \'continue\' given isLoopContinueStatus returns true', () => {
    esprimaParser.status.isLoopContinueStatus.returns(true)

    const result = esprimaParser.getLoopStatusAndReset()

    expect(
      esprimaParser.status.unset
        .calledWithExactly('continue')
    ).to.be.true
    expect(result).to.be.equal('continue')
  })

  it('should return null given isLoopBreakStatus and isLoopContinueStatus return both false', () => {
    const result = esprimaParser.getLoopStatusAndReset()

    expect(result).to.be.null
  })
})
