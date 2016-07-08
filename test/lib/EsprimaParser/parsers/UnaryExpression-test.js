'use strict'

// spec: https://github.com/estree/estree/blob/bc34a7cc861640aa8ee18d93186720be1b13db53/spec.md#unaryexpression

describe('UnaryExpression tests', () => {
  let unaryExpression

  beforeEach(() => {
    unaryExpression = createAstNode('UnaryExpression', {
      argument: createAstNode(),
      prefix: true
    })

    sandbox.stub(esprimaParser, 'unaryOperators', {
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

  describe('operations other than delete tests', () => {
    // operators other than delete
    it('should call handleOtherUnaryOperation with argument and proper operation', () => {
      unaryExpression.operator = 'otherOperators'

      esprimaParser.UnaryExpression(unaryExpression)

      expect(
        esprimaParser.handleOtherUnaryOperation
          .calledWithExactly(
            unaryExpression.argument,
            esprimaParser.unaryOperators.otherOperators
          )
      ).to.be.true
    })

    it('should return result from handleOtherUnaryOperation', () => {
      unaryExpression.operator = 'otherOperators'

      const result = esprimaParser.UnaryExpression(unaryExpression)

      expect(result).to.be.equal('resultFromHandleOtherUnaryOperation')
    })
  })

  describe('operation delete tests', () => {
    // operator delete
    it('should call handleDeleteUnaryOperation with argument and delete operation', () => {
      unaryExpression.operator = 'delete'

      esprimaParser.UnaryExpression(unaryExpression)

      expect(
        esprimaParser.handleDeleteUnaryOperation
          .calledWithExactly(
            unaryExpression.argument,
            esprimaParser.unaryOperators.delete
          )
      ).to.be.true
    })

    it('should return result from handleDeleteUnaryOperation', () => {
      unaryExpression.operator = 'delete'

      const result = esprimaParser.UnaryExpression(unaryExpression)

      expect(result).to.be.equal('resultFromHandleDeleteUnaryOperation')
    })
  })
})
