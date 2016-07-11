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
    sandbox.stub(esprimaParser, 'handleOperation', sandbox.spy(() => {
      return 'resultFromHandleOtherUnaryOperation'
    }))
    sandbox.stub(esprimaParser, 'handleReferenceOperation', sandbox.spy(() => {
      return 'resultFromhandleReferenceOperation'
    }))
  })

  describe('operations other than delete tests', () => {
    // operators other than delete
    it('should call handleOperation with argument and proper operation', () => {
      unaryExpression.operator = 'otherOperators'

      esprimaParser.UnaryExpression(unaryExpression)

      expect(
        esprimaParser.handleOperation
          .calledWithExactly(
            unaryExpression.argument,
            esprimaParser.unaryOperators.otherOperators
          )
      ).to.be.true
    })

    it('should return result from handleOperation', () => {
      unaryExpression.operator = 'otherOperators'

      const result = esprimaParser.UnaryExpression(unaryExpression)

      expect(result).to.be.equal('resultFromHandleOtherUnaryOperation')
    })
  })

  describe('operation delete tests', () => {
    // operator delete
    it('should call handleReferenceOperation with argument and delete operation', () => {
      unaryExpression.operator = 'delete'

      esprimaParser.UnaryExpression(unaryExpression)

      expect(
        esprimaParser.handleReferenceOperation
          .calledWithExactly(
            unaryExpression.argument,
            esprimaParser.unaryOperators.delete
          )
      ).to.be.true
    })

    it('should return result from handleReferenceOperation', () => {
      unaryExpression.operator = 'delete'

      const result = esprimaParser.UnaryExpression(unaryExpression)

      expect(result).to.be.equal('resultFromhandleReferenceOperation')
    })
  })
})
