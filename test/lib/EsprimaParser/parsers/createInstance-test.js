describe('createCustomInstance tests', () => {
  const initArguments = ['arg1', 'arg2', 'arg3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'FunctionAgent', function () {})
  })

  it('should call createInstanceFromFunctionAgent with all arguments passed given CalledConstructor is instance of FunctionAgent and return', () => {
    const CalledConstructor = new (esprimaParser.FunctionAgent)()

    sandbox.stub(esprimaParser, 'createInstanceFromFunctionAgent')
      .returns('resultFromCreateInstanceFromFunctionAgent')

    const result = esprimaParser.createInstance(
      CalledConstructor,
      initArguments
    )

    expect(
      esprimaParser.createInstanceFromFunctionAgent
        .calledWithExactly(CalledConstructor, initArguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromCreateInstanceFromFunctionAgent')
  })

  it('should call createInstanceFromBasicType with all arguments passed given CalledConstructor is not instance of FunctionAgent', () => {
    const CalledConstructor = function () {}

    sandbox.stub(esprimaParser, 'createInstanceFromBasicType')
      .returns('resultFromCreateInstanceFromBasicType')

    const result = esprimaParser.createInstance(
      CalledConstructor,
      initArguments
    )

    expect(
      esprimaParser.createInstanceFromBasicType
        .calledWithExactly(CalledConstructor, initArguments)
    ).to.be.true
    expect(result).to.be.equal('resultFromCreateInstanceFromBasicType')
  })
})
