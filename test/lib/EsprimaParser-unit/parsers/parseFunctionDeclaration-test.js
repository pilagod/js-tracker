describe('parseFunctionDeclaration tests', () => {
  let statements

  before(() => {
    statements = [
      createAstNode('Statement1'),
      createAstNode('FunctionDeclaration'),
      createAstNode('Statement2'),
      createAstNode('FunctionDeclaration')
    ]
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode')
  })

  it('should call parseNode with each node with type FunctionDeclaration', () => {
    esprimaParser.parseFunctionDeclaration(statements)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .calledWithExactly(statements[1])
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledWithExactly(statements[3])
    ).to.be.true
  })

  it('should return an array containing those statements with type other than FunctionDeclaration', () => {
    const result = esprimaParser.parseFunctionDeclaration(statements)

    expect(result).to.be.eql([statements[0], statements[2]])
  })
})
