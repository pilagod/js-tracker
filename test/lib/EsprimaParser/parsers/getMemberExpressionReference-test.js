describe('getMemberExpressionReference tests', () => {
  let memberExpression, expression

  before(() => {
    class Expression {
      getReference() {
        return 'resultFromExpressionGetReference'
      }
    }
    expression = new Expression()
  })

  beforeEach(() => {
    memberExpression = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'parseExpression', sandbox.spy(() => {
      return expression
    }))
    sandbox.spy(expression, 'getReference')
  })

  it('should call parseExpression with MemberExpression', () => {
    esprimaParser.getMemberExpressionReference(memberExpression)

    expect(
      esprimaParser.parseExpression
        .calledWithExactly(memberExpression)
    ).to.be.true
  })

  it('should call getReference method of the result from parseExpression and return', () => {
    const result = esprimaParser.getMemberExpressionReference(memberExpression)

    expect(expression.getReference.calledOnce).to.be.true
    expect(
      expression.getReference
        .calledWithExactly()
    ).to.be.true
    expect(result).to.be.equal('resultFromExpressionGetReference')
  })
})
