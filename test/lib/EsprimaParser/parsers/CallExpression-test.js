// spec: https://github.com/estree/estree/blob/master/spec.md#callexpression

describe('CallExpression tests', () => {
  let expression, callExpression

  before(() => {
    class Expression {}
    expression = new Expression()
  })

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

  it('should call checkAndExecute with expression object returned from parseExpression', () => {
    esprimaParser.CallExpression(callExpression)

    expect(esprimaParser.checkAndExecute.calledOnce).to.be.true
    expect(
      esprimaParser.checkAndExecute
        .calledWithExactly(expression)
    ).to.be.true
  })

  it('should return result from checkAndExecute', () => {
    const result = esprimaParser.CallExpression(callExpression)

    expect(result).to.be.equal('resultFromCheckAndExecute')
  })
})
