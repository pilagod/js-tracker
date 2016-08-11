describe('resetLoopStatus tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getLoopStatus')
      .returns('resultFromGetLoopStatus')
    sandbox.stub(esprimaParser, 'flowStatus', {
      unset: sandbox.stub()
    })
  })

  it('should call getLoopStatus', () => {
    esprimaParser.resetLoopStatus()

    expect(esprimaParser.getLoopStatus.called).to.be.true
  })

  it('should call unset of flowStatus with status given valid status', () => {
    esprimaParser.resetLoopStatus()

    expect(
      esprimaParser.flowStatus.unset
        .calledWithExactly('resultFromGetLoopStatus')
    ).to.be.true
  })

  it('should return result from getLoopStatus', () => {
    const result = esprimaParser.resetLoopStatus()

    expect(result).to.be.equal('resultFromGetLoopStatus')
  })
})
