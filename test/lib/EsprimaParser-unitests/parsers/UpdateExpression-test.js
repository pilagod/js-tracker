// spec: https://github.com/estree/estree/blob/master/spec.md#updateexpression

describe('UpdateExpression tests', () => {
  let updateExpression

  beforeEach(() => {
    updateExpression = createAstNode('UpdateExpression', {
      operator: 'updateOperator',
      argument: createAstNode('Expression'),
      prefix: 'boolean'
    })

    sandbox.stub(esprimaParser, 'parseNode')
      .returns('resultFromParseNode')
    sandbox.stub(esprimaParser, 'getUpdateValue')
      .returns('resultFromGetUpdateValue')
  })

  it('should call parseNode with argument of updateExpression', () => {
    esprimaParser.UpdateExpression(updateExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(updateExpression.argument)
    ).to.be.true
  })

  it('should call getUpdateValue with updateExpression after parseNode', () => {
    esprimaParser.UpdateExpression(updateExpression)

    expect(
      esprimaParser.getUpdateValue
        .calledWithExactly(updateExpression)
    ).to.be.true
    expect(
      esprimaParser.getUpdateValue
        .calledAfter(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should return update value given prefix true', () => {
    updateExpression.prefix = true

    const result = esprimaParser.UpdateExpression(updateExpression)

    expect(result).to.be.equal('resultFromGetUpdateValue')
  })

  it('should return origin value given prefix false', () => {
    updateExpression.prefix = false

    const result = esprimaParser.UpdateExpression(updateExpression)

    expect(result).to.be.equal('resultFromParseNode')
  })
})
