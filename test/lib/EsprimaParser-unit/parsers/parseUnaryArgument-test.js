describe('parseUnaryArgument tests', () => {
  let argument

  beforeEach(() => {
    argument = createAstNode('Expression')
  })

  it('should call getReference with argument and return given operator is delete', () => {
    const operator = 'delete'

    sandbox.stub(esprimaParser, 'getReference')
      .withArgs(argument)
        .returns('resultFromGetReference')

    const result = esprimaParser.parseUnaryArgument(argument, operator)

    expect(
      esprimaParser.getReference
        .calledWithExactly(argument)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetReference')
  })

  it('should call parseNode with argument and return given operator is unary except delete', () => {
    const operator = 'unary'

    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(argument)
        .returns('resultFromParseNode')

    const result = esprimaParser.parseUnaryArgument(argument, operator)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(argument)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseNode')
  })
})
