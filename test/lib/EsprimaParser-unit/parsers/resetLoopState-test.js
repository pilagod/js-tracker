describe('resetLoopState tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getLoopState')
      .returns('resultFromGetLoopState')
    sandbox.stub(esprimaParser, 'flowState', {
      unset: sandbox.stub()
    })
  })

  it('should call getLoopState', () => {
    esprimaParser.resetLoopState()

    expect(esprimaParser.getLoopState.called).to.be.true
  })

  it('should call unset of flowState with state given valid state', () => {
    esprimaParser.resetLoopState()

    expect(
      esprimaParser.flowState.unset
        .calledWithExactly('resultFromGetLoopState')
    ).to.be.true
  })

  it('should return result from getLoopState', () => {
    const result = esprimaParser.resetLoopState()

    expect(result).to.be.equal('resultFromGetLoopState')
  })
})
