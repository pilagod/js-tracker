describe('NewExpression tests', () => {
  const CalledConstructor = function (...calledArguments) {
    this.calledArguments = calledArguments
  }
  const calledArguments = [1, 2, 3, 4]

  let newExpression

  beforeEach(() => {
    newExpression = createAstNode('NewExpression',  {
      callee: createAstNode('Expression'),
      arguments: [createAstNode('Expression')]
    })

    sandbox.stub(esprimaParser, 'parseNode')
      .returns(CalledConstructor)
    sandbox.stub(esprimaParser, 'parseArguments')
      .returns(calledArguments)
  })

  it('should call parseNode with callee', () => {
    esprimaParser.NewExpression(newExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(newExpression.callee)
    ).to.be.true
  })

  it('should call parseArguments with arguments', () => {
    esprimaParser.NewExpression(newExpression)

    expect(
      esprimaParser.parseArguments
        .calledWithExactly(newExpression.arguments)
    ).to.be.true
  })

  it('should return an instance of result from parseNode, initialized with result from parseArguments', () => {
    const result = esprimaParser.NewExpression(newExpression)

    expect(result).to.be.instanceof(CalledConstructor)
    expect(result.calledArguments).to.be.eql(calledArguments)
  })
})
