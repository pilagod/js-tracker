describe('searchSubHoisting tests', () => {
  let statement, statements

  beforeEach(() => {
    statement = createAstNode('Statement')
    statements = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3'),
    ]
    sandbox.stub(esprimaParser, 'filterSubStatements').returns(statements)
    // sandbox.stub(esprimaParser, 'filterStatements')
    sandbox.stub(esprimaParser, 'searchHoisting')
  })

  it('should call filterSubStatements with statement', () => {
    esprimaParser.searchSubHoisting(statement)

    expect(
      esprimaParser.filterSubStatements
        .calledWithExactly(statement)
    ).to.be.true
  })

  it('should call searchHoisting with result from filterSubStatements', () => {
    esprimaParser.searchSubHoisting(statement)

    expect(
      esprimaParser.searchHoisting
        .calledWithExactly(statements)
    ).to.be.true
  })

  // it('should call filterStatements with each element in result from filterSubStatements', () => {
  //   esprimaParser.searchSubHoisting(statement)
  //
  //   expect(esprimaParser.filterStatements.calledThrice).to.be.true
  //
  //   for (const [index, block] of blockList.entries()) {
  //     expect(
  //       esprimaParser.filterStatements.getCall(index)
  //         .calledWithExactly(block)
  //     ).to.be.true
  //   }
  // })

  // it('should call searchHoisting with each result from filterStatements', () => {
  //   for (const index of blockList.keys()) {
  //     esprimaParser.filterStatements
  //       .onCall(index).returns([createAstNode(`Statement${index + 1}`)])
  //   }
  //   esprimaParser.searchSubHoisting(statement)
  //
  //   expect(esprimaParser.searchHoisting.calledThrice).to.be.true
  //
  //   for (const index of blockList.keys()) {
  //     expect(
  //       esprimaParser.searchHoisting.getCall(index)
  //         .calledWithExactly([createAstNode(`Statement${index + 1}`)])
  //     ).to.be.true
  //   }
  // })


  //
  // it('should call filterSubStatements with statement', () => {
  //   esprimaParser.searchSubHoisting(statement)
  //
  //   expect(
  //     esprimaParser.filterSubStatements
  //       .calledWithExactly(statement)
  //   ).to.be.true
  // })
  //
  // it('should call searchHoisting with each elements in result from filterSubStatements', () => {
  //   esprimaParser.searchSubHoisting(statement)
  //
  //   expect(esprimaParser.searchHoisting.calledThrice).to.be.true
  //
  //   for (const [index, statements] of subStatementsList.entries()) {
  //     expect(
  //       esprimaParser.searchHoisting.getCall(index)
  //         .calledWithExactly(statements)
  //     ).to.be.true
  //   }
  // })
})
