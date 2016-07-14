describe('getCalleeAndMethod tests', () => {
  let calleeExpression

  describe('calleeExpression other than MemberExpression', () => {
    beforeEach(() => {
      calleeExpression = createAstNode('OtherThanMemberExpression')

      sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => {
        return 'method'
      }))
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
      expect(method).to.be.eql('method')
    })
  })

  describe('calleeExpression is MemberExpression', () => {
    beforeEach(() => {
      calleeExpression = createAstNode('MemberExpression', {
        object: 'object',
        property: 'property',
        computed: 'computed'
      })

      sandbox.stub(esprimaParser, 'getObjectAsExpressionArray', sandbox.spy())
      sandbox.stub(esprimaParser, 'getPropertyAsString', sandbox.spy())
    })

    it('should call getObjectAsExpressionArray with object property of calleeExpression', () => {
      esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(
        esprimaParser.getObjectAsExpressionArray
          .calledWithExactly(calleeExpression.object)
      ).to.be.true
    })

    it('should call getPropertyAsString with property and computed property of calleeExpression', () => {
      esprimaParser.getCalleeAndMethod(calleeExpression)

      expect(
        esprimaParser.getPropertyAsString
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
      
    })
  })
})

  // describe('calleeExpression other than MemberExpression', () => {
  //   beforeEach(() => {
  //     calleeExpression = createAstNode('TypeOtherThanMemberExpression')
  //
  //     sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => {
  //       return 'parsedCallee'
  //     }))
  //   })
  //
  //   it('should call parseNode with callee', () => {
  //     esprimaParser.parseCalleeAndCalledMethod(calleeExpression, calledArguments)
  //
  //     expect(
  //       esprimaParser.parseNode
  //         .calledWithExactly(calleeExpression)
  //     ).to.be.true
  //   })
  //
  //   it('should contain \'callee\' and \'calledMethod\' property in return', () => {
  //     const result =
  //       esprimaParser.parseCalleeAndCalledMethod(calleeExpression, calledArguments)
  //
  //     expect(result).to.have.property('callee')
  //     expect(result).to.have.property('calledMethod')
  //   })
  //
  //   it('should return null callee and calledMethod object with method parsed callee and arguments calledArguments', () => {
  //     const {callee, calledMethod} =
  //       esprimaParser.parseCalleeAndCalledMethod(calleeExpression, calledArguments)
  //
  //     expect(callee).to.be.null
  //     expect(calledMethod).to.be.eql({
  //       method: 'parsedCallee',
  //       arguments: ['argument1', 'argument2', 'argument3']
  //     })
  //   })
  // })
  //
  // describe('calleeExpression MemberExpression', () => {
  //   beforeEach(() => {
  //     calleeExpression = createAstNode('MemberExpression', {
  //       object: 'object',
  //       property: 'property',
  //       computed: 'computed'
  //     })
  //
  //     sandbox.stub(esprimaParser, 'getObjectAsExpressionArray', sandbox.spy())
  //     sandbox.stub(esprimaParser, 'getPropertyAsString', sandbox.spy())
  //   })
  //
  //   it('should call getObjectAsExpressionArray with \'object\' of calleeExpression', () => {
  //     esprimaParser.parseCalleeAndCalledMethod(calleeExpression, calledArguments)
  //
  //     expect(
  //       esprimaParser.getObjectAsExpressionArray
  //         .calledWithExactly('object')
  //     ).to.be.true
  //   })
  //
  //   it('should call getPropertyAsString with \'property\' and \'computed\' of calleeExpression', () => {
  //     esprimaParser.parseCalleeAndCalledMethod(calleeExpression, calledArguments)
  //
  //     expect(
  //       esprimaParser.getPropertyAsString
  //         .calledWithExactly('property', 'computed')
  //     ).to.be.true
  //   })
  //
  //   it('should return array callee and calledMethod object with ')
  // })
