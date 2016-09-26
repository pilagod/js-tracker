describe('handleExceptionResult tests', () => {
  describe('value has been set', () => {
    const exceptionResult = {value: 'value'}

    beforeEach(() => {
      sandbox.stub(esprimaParser.flowState, 'set')
    })

    it('should call flowState.set with FlowState.RETURN', () => {
      esprimaParser.handleExceptionResult(exceptionResult)

      expect(
        esprimaParser.flowState.set
          .calledWithExactly(esprimaParser.FlowState.RETURN)
      ).to.be.true
    })

    it('should return result.value', () => {
      const result = esprimaParser.handleExceptionResult(exceptionResult)

      expect(result).to.be.equal(exceptionResult.value)
    })
  })

  describe('error has been set, but value has not', () => {
    const exceptionResult = {error: new Error()}

    it('should throw result.error', () => {
      let error

      try {
        esprimaParser.handleExceptionResult(exceptionResult)
      } catch (e) {
        error = e
      }
      expect(error).to.be.equal(exceptionResult.error)
    })
  })

  describe('value and error both has not been set', () => {
    const exceptionResult = {}

    it('should return undefined', () => {
      const result = esprimaParser.handleExceptionResult(exceptionResult)

      expect(result).to.be.undefined
    })
  })
})
