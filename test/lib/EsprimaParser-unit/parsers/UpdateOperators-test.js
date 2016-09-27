describe('UpdateOperator tests', () => {
  describe('++ operator', () => {
    it('should increment argument by 1', () => {
      const result = esprimaParser.updateOperators['++'](0)

      expect(result).to.be.equal(1)
    })

    it('should increment string argument by 1', () => {
      const result = esprimaParser.updateOperators['++']('0')

      expect(result).to.be.equal(1)
    })
  })

  describe('-- operator', () => {
    it('should decrement argument by 1', () => {
      const result = esprimaParser.updateOperators['--'](0)

      expect(result).to.be.equal(-1)
    })

    it('should decrement string argument by 1', () => {
      const result = esprimaParser.updateOperators['--']('0')

      expect(result).to.be.equal(-1)
    })
  })
})
