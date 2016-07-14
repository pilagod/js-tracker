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
})
