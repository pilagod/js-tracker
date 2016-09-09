describe.only('parseMemberCallee', () => {
  let callExpression

  beforeEach(() => {
    callExpression = createAstNode('CallExpression')
  })

  // let calleeExpression
  //
  // beforeEach(() => {
  //   calleeExpression = createAstNode('MemberExpression', {
  //     object: createAstNode('ExpressionObject'),
  //     property: createAstNode('ExpressionProperty'),
  //     computed: 'boolean'
  //   })
  //
  //   sandbox.stub(esprimaParser, 'getObjectAsExpressionArray')
  //     .returns('resultFromGetObjectAsExpressionArray')
  //   sandbox.stub(esprimaParser, 'getPropertyKey')
  //     .returns('resultFromGetPropertyKey')
  //   sandbox.stub(esprimaParser, 'getCallee')
  //     .returns('resultFromGetCallee')
  // })
  //
  // it('should call getObjectAsExpressionArray with object property of calleeExpression', () => {
  //   esprimaParser.parseMemberCallee(calleeExpression)
  //
  //   expect(
  //     esprimaParser.getObjectAsExpressionArray
  //       .calledWithExactly(calleeExpression.object)
  //   ).to.be.true
  // })
  //
  // it('should call getPropertyKey with property and computed property of calleeExpression', () => {
  //   esprimaParser.parseMemberCallee(calleeExpression)
  //
  //   expect(
  //     esprimaParser.getPropertyKey
  //       .calledWithExactly(
  //         calleeExpression.property,
  //         calleeExpression.computed
  //       )
  //   ).to.be.true
  // })
  //
  // it('should call getMethodInstance with result from getPropertyKey', () => {
  //   esprimaParser.parseMemberCallee(calleeExpression)
  //
  //   expect(
  //     esprimaParser.getCallee
  //       .calledWithExactly('resultFromGetPropertyKey')
  //   ).to.be.true
  // })
  //
  // it('should return callee from getObjectAsExpressionArray and method from getMethodInstance', () => {
  //   const {caller, callee} = esprimaParser.parseMemberCallee(calleeExpression)
  //
  //   expect(caller).to.be.equal('resultFromGetObjectAsExpressionArray')
  //   expect(callee).to.be.equal('resultFromGetCallee')
  // })
})
