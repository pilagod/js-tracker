describe('setCalledArguments tests', () => {
  const params = ['param1', 'param2', 'param3']
  const values = ['arg1', 'arg2', 'arg3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call setVariables with each param and values', () => {
    esprimaParser.setCalledArguments(params, values)

    for (const index of params.keys()) {
      expect(
        esprimaParser.setVariables.getCall(index)
          .calledWithExactly(params[index], values[index])
      ).to.be.true
    }
  })
})
