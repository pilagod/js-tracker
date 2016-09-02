// spec: https://github.com/estree/estree/blob/master/spec.md#callexpression

describe('CallExpression tests', () => {
  const expression = {
    data: 'data',
    info: 'info'
  }
  let callExpression

  beforeEach(() => {
    callExpression = createAstNode('CallExpression', {
      callee: createAstNode('Expression'),
      arguments: [createAstNode('Expression')]
    })

    sandbox.stub(esprimaParser, 'parseExpression')
      .returns(expression)
    sandbox.stub(esprimaParser, 'checkAndExecute')
      .returns('resultFromCheckAndExecute')
  })

  it('should call parseExpression with callExpression', () => {
    esprimaParser.CallExpression(callExpression)

    expect(
      esprimaParser.parseExpression
        .calledWithExactly(callExpression)
    ).to.be.true
  })

  it('should call checkAndExecute with expression data and info returned from parseExpression', () => {
    esprimaParser.CallExpression(callExpression)

    expect(esprimaParser.checkAndExecute.calledOnce).to.be.true
    expect(
      esprimaParser.checkAndExecute
        .calledWithExactly(expression.data, expression.info)
    ).to.be.true
  })

  it('should return result from checkAndExecute', () => {
    const result = esprimaParser.CallExpression(callExpression)

    expect(result).to.be.equal('resultFromCheckAndExecute')
  })
})
