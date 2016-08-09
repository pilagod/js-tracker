describe('setFunctionArguments tests', () => {
  const params = ['param1', 'param2', 'param3']
  const calledArguments = ['arg1', 'arg2', 'arg3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call setVariables with each pair of params and calledArguments', () => {
    esprimaParser.setFunctionArguments(params, calledArguments)

    for (let i = 0; i < params.length; i += 1) {
      expect(
        esprimaParser.setVariables
          .getCall(i)
            .calledWithExactly(params[i], calledArguments[i])
      ).to.be.true
    }
  })
})
