describe('parseReturnArgument tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode')
      .returns('resultFromParseNode')
  })

  it('should call parseNode with argument and return', () => {
    const argument = createAstNode('Expression')
    const result = esprimaParser.parseReturnArgument(argument)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(argument)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseNode')
  })

  it('should not call parseNode and return undefined given null argument', () => {
    const argument = null
    const result = esprimaParser.parseReturnArgument(argument)

    expect(esprimaParser.parseNode.called).to.be.false
    expect(result).to.be.undefined
  })
})
