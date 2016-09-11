describe('parseUnaryArgument tests', () => {
  let argument

  beforeEach(() => {
    argument = createAstNode('Expression')
  })

  it('should call getRefExp with argument and return given operator is delete', () => {
    const operator = 'delete'

    sandbox.stub(esprimaParser, 'getRefExp')
      .withArgs(argument)
        .returns('resultFromGetRefExp')

    const result = esprimaParser.parseUnaryArgument(argument, operator)

    expect(
      esprimaParser.getRefExp
        .calledWithExactly(argument)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetRefExp')
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
