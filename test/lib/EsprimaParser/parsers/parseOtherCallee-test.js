describe('parseOtherCallee tests', () => {
  let calleeExpression

  beforeEach(() => {
    calleeExpression = createAstNode('Expression')

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
    sandbox.stub(esprimaParser, 'getMethodInstance')
      .returns('resultFromGetMethodInstance')
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
      esprimaParser.getMethodInstance
        .calledWithExactly('parsedExpression')
    ).to.be.true
  })

  it('should return undefined callee and method from result of getMethodInstance', () => {
    const {callee, method} =
      esprimaParser.parseOtherCallee(calleeExpression)

    expect(callee).to.be.undefined
    expect(method).to.be.equal('resultFromGetMethodInstance')
  })
})
