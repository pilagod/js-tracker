describe('getNameFromVariableDeclaration tests', () => {
  let variableDeclaration, declarations

  beforeEach(() => {
    declarations = [
      createAstNode('VariableDeclarator', {id: createAstNode('Pattern1')}),
      createAstNode('VariableDeclarator', {id: createAstNode('Pattern2')}),
      createAstNode('VariableDeclarator', {id: createAstNode('Pattern3')}),
    ]
    variableDeclaration = createAstNode('VariableDeclaration', {declarations})

    sandbox.stub(esprimaParser, 'getNameFromPattern', createParseNodeStub())
  })

  it('should call getNameFromPattern with each declarations', () => {
    esprimaParser.getNameFromVariableDeclaration(variableDeclaration)

    expect(esprimaParser.getNameFromPattern.callCount).to.be.equal(declarations.length)

    for (const [index, declaration] of declarations.entries()) {
      expect(
        esprimaParser.getNameFromPattern.getCall(index)
          .calledWithExactly(declaration.id)
      ).to.be.true
    }
  })

  it('should return an array concating all results from getNameFromPattern', () => {
    const result = esprimaParser.getNameFromVariableDeclaration(variableDeclaration)

    expect(result).to.be.eql([
      'parsedPattern1',
      'parsedPattern2',
      'parsedPattern3',
    ])
  })
})
