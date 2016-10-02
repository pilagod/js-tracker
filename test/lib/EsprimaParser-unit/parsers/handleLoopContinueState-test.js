describe('handleLoopContinueState tests', () => {
  const label = 'label'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isLoopStateNeededToUnset')
    sandbox.stub(esprimaParser, 'flowState', {
      unsetContinue: sandbox.spy(),
      unsetLabel: sandbox.spy()
    })
  })

  it('should call isLoopStateNeededToUnset with label', () => {
    esprimaParser.handleLoopContinueState(label)

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

    it('should call flowState.unsetContinue', () => {
      esprimaParser.handleLoopContinueState(label)

      expect(esprimaParser.flowState.unsetContinue.called).to.be.true
    })

    it('should call flowState.unsetLabel', () => {
      esprimaParser.handleLoopContinueState(label)

      expect(esprimaParser.flowState.unsetLabel.called).to.be.true
    })

    it('should return false', () => {
      const result = esprimaParser.handleLoopContinueState(label)

      expect(result).to.be.false
    })
  })

  describe('isLoopStateNeededToUnset returns false', () => {
    beforeEach(() => {
      esprimaParser.isLoopStateNeededToUnset
        .withArgs(label).returns(false)
    })

    it('should call nothing', () => {
      esprimaParser.handleLoopContinueState(label)

      expect(esprimaParser.flowState.unsetContinue.called).to.be.false
      expect(esprimaParser.flowState.unsetLabel.called).to.be.false
    })

    it('should return true', () => {
      const result = esprimaParser.handleLoopContinueState(label)

      expect(result).to.be.true
    })
  })
})
