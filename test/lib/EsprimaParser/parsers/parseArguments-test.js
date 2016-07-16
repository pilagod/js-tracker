describe('parseArguments tests', () => {
  let calledArguments

  beforeEach(() => {
    calledArguments = [
      createAstNode('Expression1'),
      createAstNode('Expression2'),
      createAstNode('Expression3')
    ]

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
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
      'parsedExpression1',
      'parsedExpression2',
      'parsedExpression3'
    ])
  })
})
