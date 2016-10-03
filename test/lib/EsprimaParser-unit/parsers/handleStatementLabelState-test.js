describe('handleStatementLabelState tests', () => {
  const label = 'label'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isStatementLabelNeededToUnset')
    sandbox.stub(esprimaParser.flowState)
  })

  it('should call isStatementLabelNeededToUnset with label', () => {
    esprimaParser.handleStatementLabelState(label)

    expect(
      esprimaParser.isStatementLabelNeededToUnset
        .calledWithExactly(label)
    ).to.be.true
  })

  describe('isStatementLabelNeededToUnset returns true', () => {
    beforeEach(() => {
      esprimaParser.isStatementLabelNeededToUnset
        .withArgs(label).returns(true)
    })

    it('should call flowState.unsetBreak', () => {
      esprimaParser.handleStatementLabelState(label)

      expect(esprimaParser.flowState.unsetBreak.called).to.be.true
    })

    it('should call flowState.unsetLabel', () => {
      esprimaParser.handleStatementLabelState(label)

      expect(esprimaParser.flowState.unsetLabel.called).to.be.true
    })
  })

  describe('isStatementLabelNeededToUnset returns false', () => {
    beforeEach(() => {
      esprimaParser.isStatementLabelNeededToUnset
        .withArgs(label).returns(false)
    })

    it('should do nothing', () => {
      esprimaParser.handleStatementLabelState(label)

      expect(esprimaParser.flowState.unsetBreak.called).to.be.false
      expect(esprimaParser.flowState.unsetLabel.called).to.be.false

    })
  })
})
