describe('parseVariableDeclarator tests', () => {
  const variables = 'variables'
  const values = 'values'
  let variableDeclarator

  beforeEach(() => {
    variableDeclarator = createAstNode('VariableDeclarator', {
      id: createAstNode('Pattern'),
      init: createAstNode('Expression')
    })
    sandbox.stub(esprimaParser, 'getNameFromPattern').returns(variables)
    sandbox.stub(esprimaParser, 'parseNode').returns(values)
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call getNameFromPattern with variableDeclarator.id', () => {
    esprimaParser.parseVariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(variableDeclarator.id)
    ).to.be.true
  })

  it('should call parseNode with variableDeclarator.init', () => {
    esprimaParser.parseVariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(variableDeclarator.init)
    ).to.be.true
  })

  it('should call setVariables with result from getNameFromPattern and parseNode', () => {
    esprimaParser.parseVariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.setVariables
        .calledWithExactly(variables, values)
    ).to.be.true
  })
})
