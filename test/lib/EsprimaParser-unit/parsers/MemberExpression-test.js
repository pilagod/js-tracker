// spec: https://github.com/estree/estree/blob/master/spec.md#memberexpression

describe('MemberExpression tests', () => {
  let memberExpression
  // stub results
  const resultFromGetMemberExp = 'resultFromGetMemberExp'
  const resultFromParseMemberExp = 'resultFromParseMemberExp'

  beforeEach(() => {
    memberExpression = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'getMemberExp')
      .returns(resultFromGetMemberExp)
    sandbox.stub(esprimaParser, 'parseMemberExp')
      .returns(resultFromParseMemberExp)
  })

  it('should call getMemberExp with memberExpression', () => {
    esprimaParser.MemberExpression(memberExpression)

    expect(
      esprimaParser.getMemberExp
        .calledWithExactly(memberExpression)
    ).to.be.true
  })

  it('should call parseMemberExp with result from getMemberExp and return', () => {
    const result = esprimaParser.MemberExpression(memberExpression)

    expect(
      esprimaParser.parseMemberExp
        .calledWithExactly(resultFromGetMemberExp)
    )
    expect(result).to.be.equal(resultFromParseMemberExp)
  })
})
