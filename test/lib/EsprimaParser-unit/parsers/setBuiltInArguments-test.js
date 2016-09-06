describe('setBuiltInArguments tests', () => {
  const builtInArguments = {
    arguments: {}
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'setVariables')
  })

  afterEach(() => {
    delete builtInArguments.this
  })

  it('should call setVariables with \'this\' and esprimaParser.context given undefined builtInArguments.this', () => {
    builtInArguments.this = undefined
    sandbox.stub(esprimaParser, 'context', {})

    esprimaParser.setBuiltInArguments(builtInArguments)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('this', esprimaParser.context)
    ).to.be.true
  })

  it('should call setVariables with \'this\' and builtInArguments.this', () => {
    builtInArguments.this = {}

    esprimaParser.setBuiltInArguments(builtInArguments)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('this', builtInArguments.this)
    ).to.be.true
  })

  it('should call setVariables with \'arguments\' and builtInArguments.arguments', () => {
    esprimaParser.setBuiltInArguments(builtInArguments)

    expect(
      esprimaParser.setVariables
        .calledWithExactly('arguments', builtInArguments.arguments)
    ).to.be.true
  })
})
