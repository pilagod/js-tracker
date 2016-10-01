describe('setHoistings tests', () => {
  const hoistings = ['var1', 'var2', 'var3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call setVariables with each hoisting variable and undefined', () => {
    esprimaParser.setHoistings(hoistings)

    expect(esprimaParser.setVariables.calledThrice).to.be.true

    for (const [index, hoisting] of hoistings.entries()) {
      expect(
        esprimaParser.setVariables.getCall(index)
          .calledWithExactly(hoisting, undefined)
      ).to.be.true
    }
  })
})
