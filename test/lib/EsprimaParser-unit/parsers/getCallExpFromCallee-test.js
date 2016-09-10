describe('getCallExpFromCallee tests', () => {
  let callee
  // stub results
  const exp = {}

  it('should call getMemberExp with callee and return given callee is MemberExpression', () => {
    callee = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'getMemberExp').returns(exp)

    const result = esprimaParser.getCallExpFromCallee(callee)

    expect(
      esprimaParser.getMemberExp
        .calledWithExactly(callee)
    ).to.be.true
    expect(result).to.be.equal(exp)
  })

  it('should call getOtherExp with callee and return given callee is OtherExpression', () => {
    callee = createAstNode('OtherExpression')

    sandbox.stub(esprimaParser, 'getOtherExp').returns(exp)

    const result = esprimaParser.getCallExpFromCallee(callee)

    expect(
      esprimaParser.getOtherExp
        .calledWithExactly(callee)
    ).to.be.true
    expect(result).to.be.equal(exp)
  })
})
