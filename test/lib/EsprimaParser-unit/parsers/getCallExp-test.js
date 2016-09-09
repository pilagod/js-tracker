describe('getCallExp tests', () => {
  let callExpression

  beforeEach(() => {
    callExpression = createAstNode('CallExpression')
  })

  it('should call parseMemberCallee with callExpression given callee is MemberExpression', () => {
    const resultFromParseMemberCallee = 'resultFromParseMemberCallee'

    callExpression.callee = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'parseMemberCallee')
      .returns(resultFromParseMemberCallee)

    const result = esprimaParser.getCallExp(callExpression)

    expect(
      esprimaParser.parseMemberCallee
        .calledWithExactly(callExpression)
    ).to.be.true
    expect(result).to.be.equal(resultFromParseMemberCallee)
  })

  it('should call parseOtherCallee with callExpression given callee is not MemberExpression', () => {
    const resultFromParseOtherCallee = 'resultFromParseOtherCallee'

    callExpression.callee = createAstNode('OtherExpression')

    sandbox.stub(esprimaParser, 'parseOtherCallee')
      .returns(resultFromParseOtherCallee)

    const result = esprimaParser.getCallExp(callExpression)

    expect(
      esprimaParser.parseOtherCallee
        .calledWithExactly(callExpression)
    ).to.be.true
    expect(result).to.be.equal(resultFromParseOtherCallee)
  })
})
