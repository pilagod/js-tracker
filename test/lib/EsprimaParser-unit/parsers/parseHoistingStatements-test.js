describe('parseHoistingStatements tests', () => {
  let statements

  beforeEach(() => {
    statements = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3'),
    ]
    sandbox.stub(esprimaParser, 'isHoistingStatement', createResultsGenerator([false, true, false]))
  })

  it('should call isHoistingStatement with each statement', () => {
    esprimaParser.parseHoistingStatements(statements)

    expect(esprimaParser.isHoistingStatement.calledThrice).to.be.true

    for (const [index, statement] of statements.entries()) {
      expect(
        esprimaParser.isHoistingStatement.getCall(index)
          .calledWithExactly(statement)
      ).to.be.true
    }
  })

  it('should return an array containing those statements which are passed as argument to isHoistingStatement and return false', () => {
    const result = esprimaParser.parseHoistingStatements(statements)

    expect(result).to.be.eql([statements[0], statements[2]])
  })
})
