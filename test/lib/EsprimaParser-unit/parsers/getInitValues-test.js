describe('getInitValues tests', () => {
  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode')
  })

  it('should call parseNode with init and return given valid init', () => {
    const init = createAstNode('Expression')

    esprimaParser.parseNode
      .withArgs(init)
        .returns('resultFromParseNode')

    const result = esprimaParser.getInitValues(init)

    expect(result).to.be.equal('resultFromParseNode')
  })

  it('should return undefined given null init', () => {
    const init = null

    const result = esprimaParser.getInitValues(init)

    expect(esprimaParser.parseNode.called).to.be.false
    expect(result).to.be.undefined
  })
})
