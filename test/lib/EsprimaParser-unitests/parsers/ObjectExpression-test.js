// spec: https://github.com/estree/estree/blob/master/spec.md#objectexpression

describe('ObjectExpression tests', () => {
  let objectExpression

  beforeEach(() => {
    objectExpression = createAstNode('ObjectExpression')
  })

  it('should return {} given no properties', () => {
    objectExpression.properties = []

    const result = esprimaParser.ObjectExpression(objectExpression)

    expect(result).to.be.eql({})
  })

  it('should call parseNode with nodes in properties', () => {
    objectExpression.properties = [
      createAstNode('Property1'),
      createAstNode('Property2')
    ]

    sandbox.stub(esprimaParser, 'parseNode')
      .returns({key: 'key', value: 'value'})

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
      createAstNode('Property1'),
      createAstNode('Property2')
    ]

    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(objectExpression.properties[0])
        .returns({key: 'a', value: 1})
      .withArgs(objectExpression.properties[1])
        .returns({key: 'b', value: 2})

    const result = esprimaParser.ObjectExpression(objectExpression)

    expect(result).to.be.eql({a: 1, b: 2})
  })
})
