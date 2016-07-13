describe('getExpressionAsArray tests', () => {
  it('should call parseMemberExpression and return given object type MemberExpression', () => {
    const object = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'parseMemberExpression', sandbox.spy(() => {
      return ['object', 'property']
    }))

    const result = esprimaParser.getObjectAsExpressionArray(object)

    expect(
      esprimaParser.parseMemberExpression
        .calledWithExactly(object)
    ).to.be.true
    expect(result).to.be.eql(['object', 'property'])
  })

  it('should call parseCallExpression and return given object type CallExpression', () => {
    const object = createAstNode('CallExpression')

    sandbox.stub(esprimaParser, 'parseCallExpression', sandbox.spy(() => {
      return ['object', {
        method: 'method',
        arguments: 'arguments'
      }]
    }))

    const result = esprimaParser.getObjectAsExpressionArray(object)

    expect(
      esprimaParser.parseCallExpression
        .calledWithExactly(object)
    ).to.be.true
    expect(result).to.be.eql(['object', {
      method: 'method',
      arguments: 'arguments'
    }])
  })

  it('should call parseNode and return given object type other than Member & Call Expression', () => {
    const object = createAstNode('TypeOtherThanMemberAndCall')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => {
      return 'resultFromParseNode'
    }))

    const result = esprimaParser.getObjectAsExpressionArray(object)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(object)
    ).to.be.true
    expect(result).to.be.eql(['resultFromParseNode'])
  })
})
