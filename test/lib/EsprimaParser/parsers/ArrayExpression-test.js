'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#arrayexpression

describe('ArrayExpression tests', () => {
  let arrayExpression

  beforeEach(() => {
    arrayExpression = createAstNode('ArrayExpression')
  })

  it('should return [] given no elements', () => {
    arrayExpression.elements = []

    expect(esprimaParser.ArrayExpression(arrayExpression)).to.be.eql([])
  })

  it('should return [1, 2] given elements with two nodes whose value is 1 and 2 respectively', () => {
    arrayExpression.elements = [
      createAstNode('Literal', {value: 1}),
      createAstNode('Literal', {value: 2})
    ]

    sandbox.stub(esprimaParser, 'parseNode', (literal) => {
      return literal.value
    })

    expect(esprimaParser.ArrayExpression(arrayExpression)).to.be.eql([1, 2])
  });
})
