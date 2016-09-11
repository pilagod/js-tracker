describe('getCalleeExp tests', () => {
  let expression
  // stub results
  const exp = {}

  it('should call getMemberExp with expression and return given expression is MemberExpression', () => {
    expression = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'getMemberExp').returns(exp)

    const result = esprimaParser.getCalleeExp(expression)

    expect(
      esprimaParser.getMemberExp
        .calledWithExactly(expression)
    ).to.be.true
    expect(result).to.be.equal(exp)
  })

  it('should call getOtherExp with expression and return given expression is OtherExpression', () => {
    expression = createAstNode('OtherExpression')

    sandbox.stub(esprimaParser, 'getOtherExp').returns(exp)

    const result = esprimaParser.getCalleeExp(expression)

    expect(
      esprimaParser.getOtherExp
        .calledWithExactly(expression)
    ).to.be.true
    expect(result).to.be.equal(exp)
  })
})
