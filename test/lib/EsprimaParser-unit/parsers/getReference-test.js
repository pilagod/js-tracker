describe('getReference tests', () => {
  it('should call getMemberExp with expression and return given expression is MemberExpression', () => {
    const expression = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'getMemberExp')
      .withArgs(expression)
        .returns('resultFromGetMemberExp')

    const result = esprimaParser.getReference(expression)

    expect(
      esprimaParser.getMemberExp
        .calledWithExactly(expression)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetMemberExp')
  })

  it('should call getPatternExp with expression and return given expression is other expression', () => {
    const expression = createAstNode('OtherExpression')

    sandbox.stub(esprimaParser, 'getPatternExp')
      .withArgs(expression)
        .returns('resultFromGetPatternExp')

    const result = esprimaParser.getReference(expression)

    expect(
      esprimaParser.getPatternExp
        .calledWithExactly(expression)
    ).to.be.true
    expect(result).to.be.equal('resultFromGetPatternExp')
  })
})
