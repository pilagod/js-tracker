describe('setFlowStateLabel tests', () => {
  const label = 'label'
  let labelNode

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getNameFromPattern').returns(label)
    sandbox.stub(esprimaParser, 'flowState', {
      setLabel: sandbox.spy()
    })
  })

  describe('valid labelNode', () => {
    beforeEach(() => {
      labelNode = createAstNode('Identifier')
    })

    it('should call getNameFromPattern with labelNode', () => {
      esprimaParser.setFlowStateLabel(labelNode)

      expect(
        esprimaParser.getNameFromPattern
          .calledWithExactly(labelNode)
      ).to.be.true
    })

    it('should call flowState.setLabel with result from getNameFromPattern', () => {
      esprimaParser.setFlowStateLabel(labelNode)

      expect(
        esprimaParser.flowState.setLabel
          .calledWithExactly(label)
      ).to.be.true
    })
  })

  describe('null labelNode', () => {
    it('should do nothing', () => {
      esprimaParser.setFlowStateLabel(null)

      expect(esprimaParser.getNameFromPattern.called).to.be.false
      expect(esprimaParser.flowState.setLabel.called).to.be.false
    })
  })
})
