describe('initFunctionHoisting tests', () => {
  const variable = 'variable'
  let functionDeclaration

  beforeEach(() => {
    functionDeclaration = createAstNode('FunctionDeclaration', {
      id: createAstNode('Identifier')
    })
    sandbox.stub(esprimaParser, 'getNameFromPattern').returns(variable)
    sandbox.stub(esprimaParser, 'initHoisting')
  })

  it('should call getNameFromPattern with functionDeclaration.id', () => {
    esprimaParser.initFunctionHoisting(functionDeclaration)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(functionDeclaration.id)
    ).to.be.true
  })

  it('should call initHoisting with result from getNameFromPattern', () => {
    esprimaParser.initFunctionHoisting(functionDeclaration)

    expect(
      esprimaParser.initHoisting
        .calledWithExactly(variable)
    ).to.be.true
  })
})
