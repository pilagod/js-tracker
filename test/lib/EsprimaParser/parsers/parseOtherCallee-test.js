describe('parseOtherCallee tests', () => {
  let calleeExpression

  beforeEach(() => {
    calleeExpression = createAstNode('Expression')

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
    sandbox.stub(esprimaParser, 'getCallee')
      .returns('resultFromGetCallee')
  })

  it('should call parseNode with calleeExpression', () => {
    esprimaParser.parseOtherCallee(calleeExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(calleeExpression)
    ).to.be.true
  })

  it('should call getCallee with result from parseNode', () => {
    esprimaParser.parseOtherCallee(calleeExpression)

    expect(
      esprimaParser.getCallee
        .calledWithExactly('parsedExpression')
    ).to.be.true
  })

  it('should return undefined caller and callee from result of getCallee', () => {
    const {caller, callee} =
      esprimaParser.parseOtherCallee(calleeExpression)

    expect(caller).to.be.undefined
    expect(callee).to.be.equal('resultFromGetCallee')
  })
})
