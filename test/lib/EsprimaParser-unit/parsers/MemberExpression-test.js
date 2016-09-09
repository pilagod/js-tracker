// spec: https://github.com/estree/estree/blob/master/spec.md#memberexpression

describe('MemberExpression tests', () => {
  // stub results
  const resultFromParseNode = 'resultFromParseNode'
  const resultFromGetPropertyKey = 'resultFromGetPropertyKey'
  const resultFromExecute = 'resultFromExecute'
  let memberExpression

  beforeEach(() => {
    memberExpression = createAstNode('MemberExpression', {
      object: createAstNode('Expression'),
      property: createAstNode('Expression || Identifier'),
      computed: 'Boolean'
    })
    sandbox.stub(esprimaParser, 'parseNode')
      .returns(resultFromParseNode)
    sandbox.stub(esprimaParser, 'getPropertyKey')
      .returns(resultFromGetPropertyKey)
    sandbox.stub(esprimaParser, 'execute')
      .returns(resultFromExecute)
  })

  it('should call parseNode with object', () => {
    esprimaParser.MemberExpression(memberExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(memberExpression.object)
    ).to.be.true
  })

  it('should call getPropertyKey with property and computed', () => {
    esprimaParser.MemberExpression(memberExpression)

    expect(
      esprimaParser.getPropertyKey
        .calledWithExactly(memberExpression.property, memberExpression.computed)
    ).to.be.true
  })

  it('should call execute with an object containing caller of result from parseNode and callee of result from getPropertyKey', () => {
    const result = esprimaParser.MemberExpression(memberExpression)

    expect(
      esprimaParser.execute
        .calledWithExactly({
          caller: resultFromParseNode,
          callee: resultFromGetPropertyKey
        })
    ).to.be.true
    expect(result).to.be.equal(resultFromExecute)
  })
})
