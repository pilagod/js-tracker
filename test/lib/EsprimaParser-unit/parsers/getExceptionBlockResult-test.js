describe('getExceptionBlockResult tests', () => {
  const value = 'value'

  describe('flowState is RETURN', () => {
    beforeEach(() => {
      sandbox.stub(esprimaParser.flowState, 'isReturnState').returns(true)
      sandbox.stub(esprimaParser.flowState, 'unset')
    })

    it('should call flowState.unset with FlowState.RETURN', () => {
      esprimaParser.getExceptionBlockResult(value)

      expect(
        esprimaParser.flowState.unset
          .calledWithExactly(esprimaParser.FlowState.RETURN)
      ).to.be.true
    })

    it('should return an object containing given value', () => {
      const result = esprimaParser.getExceptionBlockResult(value)

      expect(result).to.be.eql({value})
    })
  })

  describe('flowState is not RETURN', () => {
    beforeEach(() => {
      sandbox.stub(esprimaParser.flowState, 'isReturnState').returns(false)
    })

    it('should return empty object', () => {
      const result = esprimaParser.getExceptionBlockResult(value)

      expect(result).to.be.eql({})
    })
  })
})
