describe('parseCalleeAndMethod tests', () => {
  let calleeExpression, calledArguments

  beforeEach(() => {
    calleeExpression = createAstNode('Expression')
    calledArguments = [
      'parsedExpression1',
      'parsedExpression2',
      'parsedExpression3'
    ]

    sandbox.stub(esprimaParser, 'getCalleeAndMethod')
      .returns({
        callee: 'calleeFromGetCalleeAndMethod',
        method: 'methodFromGetCalleeAndMethod'
      })
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

  it('should return callee from getCalleeAndMethod and method an object with property method from getCalleeAndMethod and arguments from calledArguments', () => {
    const {callee, method} =
      esprimaParser.parseCalleeAndMethod(calleeExpression, calledArguments)

    expect(callee).to.be.equal('calleeFromGetCalleeAndMethod')
    expect(method).to.be.eql({
      method: 'methodFromGetCalleeAndMethod',
      arguments: calledArguments
    })
  })
})
