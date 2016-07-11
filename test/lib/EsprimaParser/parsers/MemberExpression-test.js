// spec: https://github.com/estree/estree/blob/master/spec.md#memberexpression

describe('MemberExpression tests', () => {
  let expression, memberExpression

  before(() => {
    class Expression {
      execute() {
        return 'executedMemberExpression'
      }
    }
    expression = new Expression()
  })

  beforeEach(() => {
    memberExpression = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'parseMemberExpression', sandbox.spy(() => {
      return expression
    }))
    sandbox.spy(expression, 'execute')
  })

  it('should call parseMemberExpression with memberExpression', () => {
    esprimaParser.MemberExpression(memberExpression)

    expect(
      esprimaParser.parseMemberExpression
        .calledWithExactly(memberExpression)
    ).to.be.true
  })

  it('should call execute of expression object return from parseMemberExpression', () => {
    esprimaParser.MemberExpression(memberExpression)

    expect(expression.execute.calledOnce).to.be.true
  })

  it('should return result of execute of expression object', () => {
    const result = esprimaParser.MemberExpression(memberExpression)

    expect(result).to.be.equal('executedMemberExpression')
  })
})
