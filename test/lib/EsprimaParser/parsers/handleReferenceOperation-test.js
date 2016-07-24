describe('handleReferenceOperation tests', () => {
  const remainingArgs = [1, 'string', true, null, undefined]
  let argument, operationSpy

  beforeEach(() => {
    operationSpy = sandbox.spy(() => 'resultFromOperation')
  })

  // case MemberExpression
  describe('MemberExpression argument', () => {
    beforeEach(() => {
      argument = createAstNode('MemberExpression')

      sandbox.stub(esprimaParser, 'parseExpression')
        .returns('resultFromParseExpression')
      sandbox.stub(esprimaParser, 'getExpressionReference')
        .returns('resultFromGetExpressionReference')
    })

    it('should call parseExpression with argument', () => {
      esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        esprimaParser.parseExpression
          .calledWithExactly(argument)
      ).to.be.true
    })

    it('should call getExpressionReference with expression from parseExpression', () => {
      esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        esprimaParser.getExpressionReference
          .calledWithExactly('resultFromParseExpression')
      ).to.be.true
    })

    it('should call operation with result from getExpressionReference and remaining arguments then return', () => {
      const result = esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        operationSpy
          .calledWithExactly(
            'resultFromGetExpressionReference',
            ...remainingArgs
          )
      ).to.be.true
      expect(result).to.be.equal('resultFromOperation')
    })
  })

  // case Pattern
  describe('Pattern argument', () => {
    beforeEach(() => {
      argument = createAstNode('Pattern')

      sandbox.stub(esprimaParser, 'getNameFromPattern')
        .returns('resultFromGetNameFromPattern')
    })

    it('should call getNameFromPattern with argument', () => {
      esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        esprimaParser.getNameFromPattern
          .calledWithExactly(argument)
      ).to.be.true
    })

    it('should call operation with {property: \'resultFromGetNameFromPattern\'} and remaining arguments', () => {
      esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        operationSpy
          .calledWithExactly({
            property: 'resultFromGetNameFromPattern'
          }, ...remainingArgs)
      ).to.be.true
    })

    it('should return the result from operation', () => {
      const result = esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(result).to.be.equal('resultFromOperation')
    })
  })
})
