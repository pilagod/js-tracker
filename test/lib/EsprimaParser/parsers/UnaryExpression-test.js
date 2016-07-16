// spec: https://github.com/estree/estree/blob/bc34a7cc861640aa8ee18d93186720be1b13db53/spec.md#unaryexpression

describe('UnaryExpression tests', () => {
  let unaryExpression

  beforeEach(() => {
    unaryExpression = createAstNode('UnaryExpression', {
      argument: createAstNode('Expression'),
      prefix: 'boolean'
    })

    sandbox.stub(esprimaParser, 'unaryOperators', {
      'delete': () => 'delete',
      'otherOperators': () => 'otherOperators'
    })
    sandbox.stub(esprimaParser, 'handleOperation')
      .returns('resultFromHandleOtherUnaryOperation')
    sandbox.stub(esprimaParser, 'handleReferenceOperation')
      .returns('resultFromhandleReferenceOperation')
  })

  describe('operations other than delete', () => {
    beforeEach(() => {
      unaryExpression.operator = 'otherOperators'
    })
    // operators other than delete
    it('should call handleOperation with argument and proper operation', () => {
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
      const result = esprimaParser.UnaryExpression(unaryExpression)

      expect(result).to.be.equal('resultFromHandleOtherUnaryOperation')
    })
  })

  describe('operation delete', () => {
    beforeEach(() => {
      unaryExpression.operator = 'delete'
    })
    // operator delete
    it('should call handleReferenceOperation with argument and delete operation', () => {
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
      const result = esprimaParser.UnaryExpression(unaryExpression)

      expect(result).to.be.equal('resultFromhandleReferenceOperation')
    })
  })
})
