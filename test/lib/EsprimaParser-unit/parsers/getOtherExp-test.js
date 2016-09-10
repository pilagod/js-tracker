describe('getOtherExp tests', () => {
  let expression

  beforeEach(() => {
    expression = createAstNode('Expression')

    sandbox.stub(esprimaParser, 'parseNode')
      .returns('resultFromParseNode')
  })

  it('should call parseNode with expression', () => {
    esprimaParser.getOtherExp(expression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(expression)
    ).to.be.true
  })

  it('should return an object containing caller of undefined and callee of result from parseNode called with expression', () => {
    const result = esprimaParser.getOtherExp(expression)

    expect(result).to.be.eql({
      caller: undefined,
      callee: 'resultFromParseNode'
    })
  })
})
