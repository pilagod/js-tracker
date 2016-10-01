describe('searchSubHoistings tests', () => {
  let statement, statements

  beforeEach(() => {
    statement = createAstNode('Statement')
    statements = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3'),
    ]
    sandbox.stub(esprimaParser, 'filterSubStatements').returns(statements)
    sandbox.stub(esprimaParser, 'searchHoistings').returns(['var1', 'var2'])
  })

  it('should call filterSubStatements with statement', () => {
    esprimaParser.searchSubHoistings(statement)

    expect(
      esprimaParser.filterSubStatements
        .calledWithExactly(statement)
    ).to.be.true
  })

  it('should return result from searchHoistings called with result from filterSubStatements', () => {
    const result = esprimaParser.searchSubHoistings(statement)

    expect(
      esprimaParser.searchHoistings
        .calledWithExactly(statements)
    ).to.be.true
    expect(result).to.be.eql(['var1', 'var2'])
  })
})
