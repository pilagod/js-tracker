describe('parseOtherCallee tests', () => {
  let calleeExpression

  beforeEach(() => {
    calleeExpression = createAstNode('Expression')

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
    sandbox.stub(esprimaParser, 'getCalleeAgent')
      .returns('resultFromGetCalleeAgent')
  })

  it('should call parseNode with calleeExpression', () => {
    esprimaParser.parseOtherCallee(calleeExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(calleeExpression)
    ).to.be.true
  })

  it('should call getMethodInstance with result from parseNode', () => {
    esprimaParser.parseOtherCallee(calleeExpression)

    expect(
      esprimaParser.getCalleeAgent
        .calledWithExactly('parsedExpression')
    ).to.be.true
  })

  it('should return undefined callee and method from result of getMethodInstance', () => {
    const {caller, callee} =
      esprimaParser.parseOtherCallee(calleeExpression)

    expect(caller).to.be.undefined
    expect(callee).to.be.equal('resultFromGetCalleeAgent')
  })
})
