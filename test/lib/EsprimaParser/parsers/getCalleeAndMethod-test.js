describe('getCalleeAndMethod tests', () => {
  let calleeExpression

  describe('calleeExpression other than MemberExpression', () => {
    beforeEach(() => {
      calleeExpression = createAstNode('Expression')

      sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
    })

    it('should call parseNode with calleeExpression', () => {
      esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(
        esprimaParser.parseNode
          .calledWithExactly(calleeExpression)
      ).to.be.true
    })

    it('should return an object containing property callee and method', () => {
      const result = esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(result).to.have.property('callee')
      expect(result).to.have.property('method')
    })

    it('should return null callee and method with return result from parseNode', () => {
      const {callee, method} =
        esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(callee).to.be.null
      expect(method).to.be.equal('parsedExpression')
    })
  })

  describe('calleeExpression is MemberExpression', () => {
    beforeEach(() => {
      calleeExpression = createAstNode('MemberExpression', {
        object: createAstNode('ExpressionObject'),
        property: createAstNode('ExpressionProperty'),
        computed: 'boolean'
      })

      sandbox.stub(esprimaParser, 'getObjectAsExpressionArray')
        .returns('resultFromGetObjectAsExpressionArray')
      sandbox.stub(esprimaParser, 'getPropertyKeyAsString')
        .returns('resultFromGetPropertyKeyAsString')
    })

    it('should call getObjectAsExpressionArray with object property of calleeExpression', () => {
      esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(
        esprimaParser.getObjectAsExpressionArray
          .calledWithExactly(calleeExpression.object)
      ).to.be.true
    })

    it('should call getPropertyKeyAsString with property and computed property of calleeExpression', () => {
      esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(
        esprimaParser.getPropertyKeyAsString
          .calledWithExactly(
            calleeExpression.property,
            calleeExpression.computed
          )
      ).to.be.true
    })

    it('should return an object containing property callee and method', () => {
      const result = esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(result).to.have.property('callee')
      expect(result).to.have.property('method')
    })

    it('should return callee from getObjectAsExpressionArray and method from getPropertyAsString', () => {
      const {callee, method} = esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(callee).to.be.equal('resultFromGetObjectAsExpressionArray')
      expect(method).to.be.equal('resultFromGetPropertyKeyAsString')
    })
  })
})
