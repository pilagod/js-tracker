// spec: https://github.com/estree/estree/blob/master/spec.md#arrayexpression

describe('ArrayExpression tests', () => {
  let arrayExpression

  beforeEach(() => {
    arrayExpression = createAstNode('ArrayExpression')

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should return [] given no elements', () => {
    arrayExpression.elements = []

    expect(esprimaParser.ArrayExpression(arrayExpression)).to.be.eql([])
  })

  it('should call parseNode with nodes in elements', () => {
    arrayExpression.elements = [
      createAstNode('Expression1'),
      createAstNode('Expression2'),
      createAstNode('Expression3')
    ]
    esprimaParser.ArrayExpression(arrayExpression)

    arrayExpression.elements.forEach((node, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(node)
      ).to.be.true
    })
    expect(esprimaParser.parseNode.calledThrice).to.be.true
  })

  it('should return an array containig all parsed elements', () => {
    arrayExpression.elements = [
      createAstNode('Expression1'),
      createAstNode('Expression2'),
      createAstNode('Expression3')
    ]
    const result = esprimaParser.ArrayExpression(arrayExpression)

    expect(result).to.be.eql([
      'parsedExpression1',
      'parsedExpression2',
      'parsedExpression3'
    ])
  });

  it('should delete null node', () => {
    arrayExpression.elements = [
      createAstNode('Expression1'),
      null,
      createAstNode('Expression3')
    ]
    const result = esprimaParser.ArrayExpression(arrayExpression)

    expect(result).to.be.eql([
      'parsedExpression1',
      ,
      'parsedExpression3'
    ])
  })
})
