'use strict'

// spec: https://github.com/estree/estree/blob/bc34a7cc861640aa8ee18d93186720be1b13db53/spec.md#unaryexpression

describe('UnaryExpression tests', () => {
  let unaryExpression

  beforeEach(() => {
    unaryExpression = createAstNode('UnaryExpression', {
      argument: createAstNode(),
      prefix: true
    })

    sandbox.stub(esprimaParser, 'unaryOperator', {
      'delete': () => 'delete',
      'otherOperators': () => 'otherOperators'
    })
    sandbox.stub(esprimaParser, 'handleOtherUnaryOperation', sandbox.spy(() => {
      return 'resultFromHandleOtherUnaryOperation'
    }))
    sandbox.stub(esprimaParser, 'handleDeleteUnaryOperation', sandbox.spy(() => {
      return 'resultFromHandleDeleteUnaryOperation'
    }))
  })

  // operators other than delete
  it('should call handleOtherUnaryOperation with argument and proper operation given operator other than delete', () => {
    unaryExpression.operator = 'otherOperators'

    esprimaParser.UnaryExpression(unaryExpression)

    expect(
      esprimaParser.handleOtherUnaryOperation
        .calledWithExactly(
          unaryExpression.argument,
          esprimaParser.unaryOperator.otherOperators
        )
    ).to.be.true
  })

  it('should return result from handleOtherUnaryOperation given operator other than delete', () => {
    unaryExpression.operator = 'otherOperators'

    const result = esprimaParser.UnaryExpression(unaryExpression)

    expect(result).to.be.equal('resultFromHandleOtherUnaryOperation')
  })

  // operator delete
  it('should call handleDeleteUnaryOperation with argument and delete operation given operator delete', () => {
    unaryExpression.operator = 'delete'

    esprimaParser.UnaryExpression(unaryExpression)

    expect(
      esprimaParser.handleDeleteUnaryOperation
        .calledWithExactly(
          unaryExpression.argument,
          esprimaParser.unaryOperator.delete
        )
    ).to.be.true
  })

  it('should return result from handleDeleteUnaryOperation given operator delete', () => {
    unaryExpression.operator = 'delete'

    const result = esprimaParser.UnaryExpression(unaryExpression)

    expect(result).to.be.equal('resultFromHandleDeleteUnaryOperation')
  })
})
