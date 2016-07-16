describe('handleReferenceOperation tests', () => {
  let argument, operationSpy, remainingArgs

  before(() => {
    remainingArgs = [1, 'string', true, null, undefined]
  })

  beforeEach(() => {
    operationSpy = sandbox.spy(() => 'resultFromOperation')
  })

  // case Identifier
  describe('Identifier argument', () => {
    beforeEach(() => {
      argument = createAstNode('Identifier', {name: 'a'})
    })

    it('should call operation with {property: \'a\'} and remaining arguments', () => {
      esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        operationSpy
          .calledWithExactly({property: 'a'}, ...remainingArgs)
      ).to.be.true
    })

    it('should return the result from operation', () => {
      const result = esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(result).to.be.equal('resultFromOperation')
    })
  })

  // case MemberExpression
  describe('MemberExpression argument', () => {
    beforeEach(() => {
      argument = createAstNode('MemberExpression')

      sandbox.stub(esprimaParser, 'getMemberExpressionReference')
        .returns('resultFromGetMemberExpressionReference')
    })

    it('should call getMemberExpressionReference with argument', () => {
      esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        esprimaParser.getMemberExpressionReference
          .calledWithExactly(argument)
      ).to.be.true
    })

    it('should call operation with result from getMemberExpressionReference and remaining arguments then return', () => {
      const result = esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        operationSpy
          .calledWithExactly(
            'resultFromGetMemberExpressionReference',
            ...remainingArgs
          )
      ).to.be.true
      expect(result).to.be.equal('resultFromOperation')
    })
  })

  // @TODO: need to test outlier
  describe('Other argument', () => {
    beforeEach(() => {
      argument = createAstNode('Expression')
    })

    it('should return undefined', () => {
      const result = esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(result).to.be.undefined
    })
  })
})
