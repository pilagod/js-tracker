describe('getObjectAsExpressionArray tests', () => {
  it('should call parseMemberExpression and return given object type MemberExpression', () => {
    const object = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'parseMemberExpression')
      .returns(['object', 'property'])

    const result = esprimaParser.getObjectAsExpressionArray(object)

    expect(
      esprimaParser.parseMemberExpression
        .calledWithExactly(object)
    ).to.be.true
    expect(result).to.be.eql(['object', 'property'])
  })

  it('should call parseCallExpression and return given object type CallExpression', () => {
    const object = createAstNode('CallExpression')

    sandbox.stub(esprimaParser, 'parseCallExpression')
      .returns(['callee', {
        method: 'method',
        arguments: 'arguments'
      }])

    const result = esprimaParser.getObjectAsExpressionArray(object)

    expect(
      esprimaParser.parseCallExpression
        .calledWithExactly(object)
    ).to.be.true
    expect(result).to.be.eql(['callee', {
      method: 'method',
      arguments: 'arguments'
    }])
  })

  it('should call parseNode and return an array given object type other than Member & Call Expression', () => {
    const object = createAstNode('Expression')

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())

    const result = esprimaParser.getObjectAsExpressionArray(object)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(object)
    ).to.be.true
    expect(result).to.be.instanceof(Array)
    expect(result).to.be.eql(['parsedExpression'])
  })
})
