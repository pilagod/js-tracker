describe('handleHoisting tests', () => {
  const hoistings = ['var1', 'var2']
  let statements

  beforeEach(() => {
    statements = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3'),
    ]
    sandbox.stub(esprimaParser, 'searchHoistings').returns(hoistings)
    sandbox.stub(esprimaParser, 'setHoistings')
  })

  it('should call searchHoistings with statements', () => {
    esprimaParser.handleHoisting(statements)

    expect(
      esprimaParser.searchHoistings
        .calledWithExactly(statements)
    ).to.be.true
  })

  it('should call setHoistings with result from searchHoistings', () => {
    esprimaParser.handleHoisting(statements)

    expect(
      esprimaParser.setHoistings
        .calledWithExactly(hoistings)
    ).to.be.true
  })
})
