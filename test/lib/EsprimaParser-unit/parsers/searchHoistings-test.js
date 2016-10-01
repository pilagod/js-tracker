describe('searchHoistings tests', () => {
  let statements

  beforeEach(() => {
    statements = [
      createAstNode('Statement1'),
      null,
      createAstNode('Statement3')
    ]
    sandbox.stub(esprimaParser, 'parseHoisting')
      .onCall(0).returns(['var1', 'var2'])
      .onCall(1).returns(['var3'])
  })

  it('should call parseHoisting with each statement but not null', () => {
    esprimaParser.searchHoistings(statements)

    expect(esprimaParser.parseHoisting.calledTwice).to.be.true
    expect(
      esprimaParser.parseHoisting.getCall(0)
        .calledWithExactly(statements[0])
    ).to.be.true
    expect(
      esprimaParser.parseHoisting.getCall(1)
        .calledWithExactly(statements[2])
    ).to.be.true
  })

  it('should return an array concating all results from parseHoisting', () => {
    const result = esprimaParser.searchHoistings(statements)

    expect(result).to.be.eql(['var1', 'var2', 'var3'])
  })
})
