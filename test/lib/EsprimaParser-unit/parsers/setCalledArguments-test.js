describe('setCalledArguments tests', () => {
  const params = {
    keys: ['param1', 'param2', 'param3'],
    values: ['arg1', 'arg2', 'arg3']
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call setVariables with each param\'s keys and values', () => {
    esprimaParser.setCalledArguments(params)

    const length = params.keys.length

    for (let i = 0; i < length; i += 1) {
      expect(
        esprimaParser.setVariables
          .getCall(i)
            .calledWithExactly(params.keys[i], params.values[i])
      ).to.be.true
    }
  })
})
