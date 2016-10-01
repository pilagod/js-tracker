describe('parseStatements tests', () => {
  let statements, nonHoistingStatements

  before(() => {
    statements = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
    ]
  })

  beforeEach(() => {
    nonHoistingStatements = [statements[1]]

    sandbox.stub(esprimaParser, 'handleHoisting')
    sandbox.stub(esprimaParser, 'parseHoistingStatements')
      .returns(nonHoistingStatements)
    sandbox.stub(esprimaParser, 'parseNonHoistingStatements')
      .returns('resultFromParseNonHoistingStatements')
  })

  it('should call handleHoisting with statements', () => {
    esprimaParser.parseStatements(statements)

    expect(
      esprimaParser.handleHoisting
        .calledWithExactly(statements)
    ).to.be.true
  })

  it('should call parseHoistingStatements with statements', () => {
    esprimaParser.parseStatements(statements)

    expect(
      esprimaParser.parseHoistingStatements
        .calledWithExactly(statements)
    ).to.be.true
  })

  it('should call parseNonHoistingStatements with result from parseHoistingStatements and return', () => {
    const result = esprimaParser.parseStatements(statements)

    expect(
      esprimaParser.parseNonHoistingStatements
        .calledWithExactly(nonHoistingStatements)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseNonHoistingStatements')
  })

})
