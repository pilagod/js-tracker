'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#objectexpression

describe('ObjectExpression tests', () => {
  let objectExpression

  beforeEach(() => {
    objectExpression = createAstNode('ObjectExpression')
  })

  it('should return {} given no properties', () => {
    objectExpression.properties = []

    expect(esprimaParser.ObjectExpression(objectExpression)).to.be.eql({})
  })

  it('should return {a: 1, b: 2} given properties \'a: 1\' and \'b: 2\'', () => {
    objectExpression.properties = [
      createAstNode('Property', {
        key: createAstNode('Literal', {value: 'a'}),
        value: createAstNode('Literal', {value: 1})
      }),
      createAstNode('Property', {
        key: createAstNode('Literal', {value: 'b'}),
        value: createAstNode('Literal', {value: 2})
      })
    ]

    sandbox.stub(esprimaParser, 'parseNode', (property) => {
      return {
        key: property.key.value,
        value: property.value.value
      }
    })

    expect(esprimaParser.ObjectExpression(objectExpression)).to.be.eql({a: 1, b: 2})
  })
})
