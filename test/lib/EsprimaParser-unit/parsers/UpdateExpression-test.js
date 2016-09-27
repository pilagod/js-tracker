// spec: https://github.com/estree/estree/blob/master/spec.md#updateexpression

describe('UpdateExpression tests', () => {
  const origin = 'origin'
  const update = 'update'
  let updateExpression

  beforeEach(() => {
    updateExpression = createAstNode('UpdateExpression', {
      operator: 'updateOperator',
      argument: createAstNode('Expression'),
      prefix: 'boolean'
    })
    sandbox.stub(esprimaParser, 'parseNode').returns(origin)
    sandbox.stub(esprimaParser, 'updateOperators', {
      'updateOperator': sandbox.stub().returns(update)
    })
    sandbox.stub(esprimaParser, 'setUpdateValue')
  })

  it('should call parseNode with argument of updateExpression', () => {
    esprimaParser.UpdateExpression(updateExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(updateExpression.argument)
    ).to.be.true
  })

  it('should call given update operation with result from parseNode', () => {
    esprimaParser.UpdateExpression(updateExpression)

    expect(
      esprimaParser.updateOperators[updateExpression.operator]
        .calledWithExactly(origin)
    ).to.be.true
  })

  it('should call setUpdateValue with updateExpression.argument and update from update operation', () => {
    esprimaParser.UpdateExpression(updateExpression)

    expect(
      esprimaParser.setUpdateValue
        .calledWithExactly(updateExpression.argument, update)
    ).to.be.true
  })

  it('should return update value given prefix true', () => {
    updateExpression.prefix = true

    const result = esprimaParser.UpdateExpression(updateExpression)

    expect(result).to.be.equal(update)
  })

  it('should return update value given prefix false', () => {
    updateExpression.prefix = false

    const result = esprimaParser.UpdateExpression(updateExpression)

    expect(result).to.be.equal(origin)
  })
})
