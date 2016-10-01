describe('checkHoisting tests', () => {
  let statement

  it('should call initFunctionHoisting with statement given FunctionDeclaration', () => {
    statement = createAstNode('FunctionDeclaration')

    sandbox.stub(esprimaParser, 'initFunctionHoisting')

    esprimaParser.checkHoisting(statement)

    expect(
      esprimaParser.initFunctionHoisting
        .calledWithExactly(statement)
    ).to.be.true
  })

  it('should call initVariableHoisting with statement given VariableDeclaration', () => {
    statement = createAstNode('VariableDeclaration')

    sandbox.stub(esprimaParser, 'initVariableHoisting')

    esprimaParser.checkHoisting(statement)

    expect(
      esprimaParser.initVariableHoisting
        .calledWithExactly(statement)
    ).to.be.true
  })

  it('should call searchSubHoisting with statement given other statement', () => {
    statement = createAstNode('Statement')

    sandbox.stub(esprimaParser, 'searchSubHoisting')

    esprimaParser.checkHoisting(statement)

    expect(
      esprimaParser.searchSubHoisting
        .calledWithExactly(statement)
    ).to.be.true
  })
})
