'use strict'

// spec: https://github.com/estree/estree/blob/bc34a7cc861640aa8ee18d93186720be1b13db53/spec.md#unaryexpression

describe('UnaryExpression tests', () => {
  let unaryExpression

  beforeEach(() => {
    unaryExpression = createAstNode('UnaryExpression', {
      argument: createAstNode(),
      operator: 'possibleOperator',
      prefix: true
    })

    sandbox.stub(esprimaParser, 'getUnaryExpressionResult', sandbox.spy(() => {
      return 'resultFromGetUnaryExpressionResult'
    }))
    sandbox.stub(esprimaParser, 'unaryOperator', {
      'possibleOperator': sandbox.spy()
    })
  })

  it('should call getUnaryExpressionResult with argument and operation', () => {
    esprimaParser.UnaryExpression(unaryExpression)

    expect(
      esprimaParser.getUnaryExpressionResult
        .calledWithExactly(
          unaryExpression.argument,
          esprimaParser.unaryOperator.possibleOperator
        )
    ).to.be.true
  })

  it('should return result from getUnaryExpressionResult', () => {
    const result = esprimaParser.UnaryExpression(unaryExpression)

    expect(result).to.be.equal('resultFromGetUnaryExpressionResult')
  })
})
