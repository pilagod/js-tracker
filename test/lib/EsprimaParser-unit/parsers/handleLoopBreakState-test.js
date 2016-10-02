describe('handleLoopBreakState tests', () => {
  const label = 'label'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isLoopStateNeededToUnset')
    sandbox.stub(esprimaParser, 'flowState', {
      unsetBreak: sandbox.spy(),
      unsetLabel: sandbox.spy()
    })
  })

  it('should call isLoopStateNeededToUnset with label', () => {
    esprimaParser.handleLoopBreakState(label)

    expect(
      esprimaParser.isLoopStateNeededToUnset
        .calledWithExactly(label)
    ).to.be.true
  })

  describe('isLoopStateNeededToUnset returns true', () => {
    beforeEach(() => {
      esprimaParser.isLoopStateNeededToUnset
        .withArgs(label).returns(true)
    })

    it('should call flowState.unsetBreak', () => {
      esprimaParser.handleLoopBreakState(label)

      expect(esprimaParser.flowState.unsetBreak.called).to.be.true
    })

    it('should call flowState.unsetLabel', () => {
      esprimaParser.handleLoopBreakState(label)

      expect(esprimaParser.flowState.unsetLabel.called).to.be.true
    })
  })

  describe('isLoopStateNeededToUnset returns false', () => {
    beforeEach(() => {
      esprimaParser.isLoopStateNeededToUnset
        .withArgs(label).returns(false)
    })

    it('should call nothing', () => {
      esprimaParser.handleLoopBreakState(label)

      expect(esprimaParser.flowState.unsetBreak.called).to.be.false
      expect(esprimaParser.flowState.unsetLabel.called).to.be.false
    })
  })

  it('should always return true', () => {
    const result = esprimaParser.handleLoopBreakState(label)

    expect(result).to.be.true
  })
})
