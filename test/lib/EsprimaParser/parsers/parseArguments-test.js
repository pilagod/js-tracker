describe('parseArguments tests', () => {
  const calledArguments = ['argument1', 'argument2', 'argument3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy((argument) => {
      return `parsed${argument.charAt(0).toUpperCase()}${argument.slice(1)}`
    }))
  })

  it('should call parseNode with each argument', () => {
    esprimaParser.parseArguments(calledArguments)

    calledArguments.forEach((argument, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(argument)
      ).to.be.true
    })
    expect(esprimaParser.parseNode.calledThrice).to.be.true
  })

  it('should return an array containing all parsed arguments', () => {
    const result = esprimaParser.parseArguments(calledArguments)

    expect(result).to.be.eql([
      'parsedArgument1',
      'parsedArgument2',
      'parsedArgument3'
    ])
  })
})
