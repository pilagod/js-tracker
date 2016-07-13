describe('parseCalleeAndMethod tests', () => {
  const calleeExpression = 'calleeExpression'
  const calledArguments = ['argument1', 'argument2', 'argument3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getCalleeAndMethod', sandbox.spy(() => {
      return {
        callee: 'calleeFromGetCalleeAndMethod',
        method: 'methodFromGetCalleeAndMethod'
      }
    }))
  })

  it('should call getCalleeAndMethod with calleeExpression', () => {
    esprimaParser.parseCalleeAndMethod(calleeExpression, calledArguments)

    expect(
      esprimaParser.getCalleeAndMethod
        .calledWithExactly(calleeExpression)
    ).to.be.true
  })

  it('should return an object having property \'callee\' and \'method\'', () => {
    const result =
      esprimaParser.parseCalleeAndMethod(calleeExpression, calledArguments)

    expect(result).to.have.property('callee')
    expect(result).to.have.property('method')
  })

  it('should return callee from getCalleeAndMethod and method object with property method from getCalleeAndMethod and arguments from calledArguments', () => {
    const {callee, method} =
      esprimaParser.parseCalleeAndMethod(calleeExpression, calledArguments)

    expect(callee).to.be.equal('calleeFromGetCalleeAndMethod')
    expect(method).to.be.eql({
      method: 'methodFromGetCalleeAndMethod',
      arguments: calledArguments
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
})
