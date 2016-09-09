describe('parseStatements tests', () => {
  let statements, otherStatements

  before(() => {
    statements = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
    ]
  })

  beforeEach(() => {
    otherStatements = [statements[1]]

    sandbox.stub(esprimaParser, 'parseFunctionDeclaration')
      .returns(otherStatements)
    sandbox.stub(esprimaParser, 'parseOtherStatements')
      .returns('resultFromParseOtherStatements')
  })

  it('should call parseFunctionDeclaration with statements', () => {
    esprimaParser.parseStatements(statements)

    expect(
      esprimaParser.parseFunctionDeclaration
        .calledWithExactly(statements)
    ).to.be.true
  })

  it('should call parseOtherStatements with result from parseFunctionDeclaration and return', () => {
    const result = esprimaParser.parseStatements(statements)

    expect(
      esprimaParser.parseOtherStatements
        .calledWithExactly(otherStatements)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseOtherStatements')
  })

})
