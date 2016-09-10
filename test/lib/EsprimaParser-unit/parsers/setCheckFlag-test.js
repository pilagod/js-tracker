describe('setCheckFlag tests', () => {
  const exp = {
    callee: {callee: 'callee'},
    info: {info: 'info'}
  }
  it('should return false given checkFlag is true', () => {
    exp.caller = {caller: 'caller'}
    esprimaParser.checkFlag = true

    const result = esprimaParser.setCheckFlag(exp)

    expect(result).to.be.false
  })

  it('should return false given exp.caller is undefined', () => {
    exp.caller = undefined
    esprimaParser.checkFlag = false

    const result = esprimaParser.setCheckFlag(exp)

    expect(result).to.be.false
  })

  describe('given false checkFlag and valid caller', () => {
    const status = {}
    const boolean = 'boolean'

    beforeEach(() => {
      exp.caller = {caller: 'caller'}
      esprimaParser.checkFlag = false

      sandbox.stub(esprimaParser, 'context', {})
      sandbox.stub(esprimaParser.checkerDispatcher, 'dispatch')
        .returns(status)
      sandbox.stub(esprimaParser, 'tryToSetCheckFlag')
        .returns(boolean)
    })

    it('should call dispatch of checkerDispatcher with an object containing context, caller and callee', () => {
      esprimaParser.setCheckFlag(exp)

      expect(
        esprimaParser.checkerDispatcher.dispatch
          .calledWithExactly({
            context: esprimaParser.context,
            caller: exp.caller,
            callee: exp.callee
          })
      ).to.be.true
    })

    it('should call tryToSetCheckFlag with exp and status (from dispatch) and return', () => {
      const result = esprimaParser.setCheckFlag(exp)

      expect(
        esprimaParser.tryToSetCheckFlag
          .calledWithExactly(exp, status)
      ).to.be.true
      expect(result).to.be.equal(boolean)
    })
  })
})
