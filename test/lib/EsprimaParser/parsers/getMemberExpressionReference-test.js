describe('getMemberExpressionReference tests', () => {
  let memberExpression, expression

  before(() => {
    class Expression {
      getReference() {}
    }
    expression = new Expression()
  })

  beforeEach(() => {
    memberExpression = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'parseExpression')
      .returns(expression)
    sandbox.stub(expression, 'getReference')
      .returns('resultFromGetReference')
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
    expect(result).to.be.equal('resultFromGetReference')
  })
})
