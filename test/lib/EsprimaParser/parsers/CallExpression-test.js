// spec: https://github.com/estree/estree/blob/master/spec.md#callexpression

describe('CallExpression tests', () => {
  let expression, callExpression

  before(() => {
    class Expression {}
    expression = new Expression()
  })

  beforeEach(() => {
    callExpression = createAstNode('CallExpression', {
      callee: null,
      arguments: []
    })

    sandbox.stub(esprimaParser, 'parseExpression', sandbox.spy(() => {
      return expression
    }))
    sandbox.stub(esprimaParser, 'checkAndExecute', sandbox.spy(() => {
      return 'checkAndExecutedExpression'
    }))
  })

  it('should call parseExpression with callExpression', () => {
    esprimaParser.CallExpression(callExpression)

    expect(
      esprimaParser.parseExpression
        .calledWithExactly(callExpression)
    ).to.be.true
  })

  it('should call checkAndExecute of expression object return from parseExpression', () => {
    esprimaParser.CallExpression(callExpression)

    expect(esprimaParser.checkAndExecute.calledOnce).to.be.true
  })

  it('should return result from checkAndExecute of expression object', () => {
    const result = esprimaParser.CallExpression(callExpression)

    expect(result).to.be.equal('checkAndExecutedExpression')
  })
})
