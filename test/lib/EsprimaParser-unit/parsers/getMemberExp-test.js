describe('getMemberExp tests', () => {
  let memberExpression
  // stub results
  const caller = 'resultFromParseNode'
  const callee = 'resultFromGetPropertyKey'

  beforeEach(() => {
    memberExpression = createAstNode('MemberExpression', {
      object: createAstNode('Expression'),
      property: createAstNode('Expression || Identifier'),
      computed: 'Boolean'
    })
    sandbox.stub(esprimaParser, 'parseNode')
      .returns(caller)
    sandbox.stub(esprimaParser, 'getPropertyKey')
      .returns(callee)
  })

  it('should call parseNode with object', () => {
    esprimaParser.getMemberExp(memberExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(memberExpression.object)
    ).to.be.true
  })

  it('should call getPropertyKey with property and computed', () => {
    esprimaParser.getMemberExp(memberExpression)

    expect(
      esprimaParser.getPropertyKey
        .calledWithExactly(memberExpression.property, memberExpression.computed)
    ).to.be.true
  })

  it('should return an object containing caller of result from parseNode and callee of result from getPropertyKey', () => {
    const result = esprimaParser.getMemberExp(memberExpression)

    expect(result).to.be.eql({caller, callee})
  })
})
