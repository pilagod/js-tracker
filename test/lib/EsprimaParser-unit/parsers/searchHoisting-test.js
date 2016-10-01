describe('searchHoisting tests', () => {
  let statements

  beforeEach(() => {
    statements = [
      createAstNode('Statement1'),
      null,
      createAstNode('Statement3')
    ]
    sandbox.stub(esprimaParser, 'checkHoisting')
  })

  it('should call checkHoisting with each statement but not null', () => {
    esprimaParser.searchHoisting(statements)

    expect(esprimaParser.checkHoisting.calledTwice).to.be.true
    expect(
      esprimaParser.checkHoisting.getCall(0)
        .calledWithExactly(statements[0])
    ).to.be.true
    expect(
      esprimaParser.checkHoisting.getCall(1)
        .calledWithExactly(statements[2])
    ).to.be.true
  })
})
