describe('parseMemberCallee', () => {
  let calleeExpression

  beforeEach(() => {
    calleeExpression = createAstNode('MemberExpression', {
      object: createAstNode('ExpressionObject'),
      property: createAstNode('ExpressionProperty'),
      computed: 'boolean'
    })

    sandbox.stub(esprimaParser, 'getObjectAsExpressionArray')
      .returns('resultFromGetObjectAsExpressionArray')
    sandbox.stub(esprimaParser, 'getPropertyKeyAsString')
      .returns('resultFromGetPropertyKeyAsString')
    sandbox.stub(esprimaParser, 'getMethodInstance')
      .returns('resultFromGetMethodInstance')
  })

  it('should call getObjectAsExpressionArray with object property of calleeExpression', () => {
    esprimaParser.parseMemberCallee(calleeExpression)

    expect(
      esprimaParser.getObjectAsExpressionArray
        .calledWithExactly(calleeExpression.object)
    ).to.be.true
  })

  it('should call getPropertyKeyAsString with property and computed property of calleeExpression', () => {
    esprimaParser.parseMemberCallee(calleeExpression)

    expect(
      esprimaParser.getPropertyKeyAsString
        .calledWithExactly(
          calleeExpression.property,
          calleeExpression.computed
        )
    ).to.be.true
  })

  it('should call getMethodInstance with result from getPropertyKeyAsString', () => {
    esprimaParser.parseMemberCallee(calleeExpression)

    expect(
      esprimaParser.getMethodInstance
        .calledWithExactly('resultFromGetPropertyKeyAsString')
    ).to.be.true
  })

  it('should return callee from getObjectAsExpressionArray and method from getMethodInstance', () => {
    const {callee, method} = esprimaParser.parseMemberCallee(calleeExpression)

    expect(callee).to.be.equal('resultFromGetObjectAsExpressionArray')
    expect(method).to.be.equal('resultFromGetMethodInstance')
  })
})
