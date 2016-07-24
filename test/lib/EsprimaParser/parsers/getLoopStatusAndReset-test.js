describe('getLoopStatusAndReset tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'flowStatus', {
      unset: sandbox.spy(),
      isLoopBreakStatus: sandbox.stub(),
      isLoopContinueStatus: sandbox.stub()
    })
  })

  it('should unset flowStatus of \'break\' and return \'break\' given isLoopBreakStatus returns true', () => {
    esprimaParser.flowStatus.isLoopBreakStatus.returns(true)

    const result = esprimaParser.getLoopStatusAndReset()

    expect(
      esprimaParser.flowStatus.unset
        .calledWithExactly('break')
    ).to.be.true
    expect(result).to.be.equal('break')
  })

  it('should unset status of \'continue\' and return \'continue\' given isLoopContinueStatus returns true', () => {
    esprimaParser.flowStatus.isLoopContinueStatus.returns(true)

    const result = esprimaParser.getLoopStatusAndReset()

    expect(
      esprimaParser.flowStatus.unset
        .calledWithExactly('continue')
    ).to.be.true
    expect(result).to.be.equal('continue')
  })

  it('should return null given isLoopBreakStatus and isLoopContinueStatus return both false', () => {
    const result = esprimaParser.getLoopStatusAndReset()

    expect(result).to.be.null
  })
})
