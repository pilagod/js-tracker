describe('handleReferenceOperation tests', () => {
  let argument, remainingArgs, operationSpy

  before(() => {
    remainingArgs = [1, 'string', true, null, undefined]
  })

  beforeEach(() => {
    operationSpy = sandbox.spy(() => 'resultFromOperation')
  })

  // case Identifier -> call operation with reference property and remaining arguments
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
  //   -> call parseExpression,
  //   -> call getReference to get object and property (call getExpressionReference),
  //   -> call operation with reference and remaining arguments
  describe('MemberExpression argument', () => {
    beforeEach(() => {
      argument = createAstNode('MemberExpression')

      sandbox.stub(esprimaParser, 'getMemberExpressionReference', sandbox.spy(() => {
        return 'resultFromGetMemberExpressionReference'
      }))
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
          .calledWithExactly('resultFromGetMemberExpressionReference', ...remainingArgs)
      ).to.be.true
      expect(result).to.be.equal('resultFromOperation')
    })
  })

  // @TODO: need to test outlier
  describe('Other argument', () => {
    beforeEach(() => {
      argument = createAstNode('Other')
    })

    it('should return undefined', () => {
      const result = esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(result).to.be.undefined
    })
  })
})
