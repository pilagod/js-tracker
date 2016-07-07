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

  it('should call parseNode with nodes in properties', () => {
    objectExpression.properties = [
      createAstNode('Property'),
      createAstNode('Property')
    ]

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => {
      return {
        key: null,
        value: null
      }
    }))

    esprimaParser.ObjectExpression(objectExpression)

    objectExpression.properties.forEach((node, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(node)
      ).to.be.true
    })
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
