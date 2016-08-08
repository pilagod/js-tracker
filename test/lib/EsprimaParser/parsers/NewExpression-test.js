describe('NewExpression tests', () => {
  let newExpression

  beforeEach(() => {
    newExpression = createAstNode('NewExpression',  {
      callee: createAstNode('Expression'),
      arguments: [createAstNode('Expression')]
    })

    sandbox.stub(esprimaParser, 'parseNode')
      .returns('resultFromParseNode')
    sandbox.stub(esprimaParser, 'parseArguments')
      .returns('resultFromParseArguments')
    sandbox.stub(esprimaParser, 'createInstance')
      .returns('resultFromCreateInstance')
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

  it('should call createInstance with CalledConstructor from parseNode and initArguments from parseArguments and return', () => {
    const result = esprimaParser.NewExpression(newExpression)

    expect(
      esprimaParser.createInstance
        .calledWithExactly(
          'resultFromParseNode',
          'resultFromParseArguments'
        )
    ).to.be.true
    expect(result).to.be.equal('resultFromCreateInstance')
  })
})
