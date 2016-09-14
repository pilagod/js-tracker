// spec: https://github.com/estree/estree/blob/master/spec.md#variabledeclarator

describe('VariableDeclarator tests', () => {
  const variables = 'variables'
  const values = 'values'
  let variableDeclarator

  beforeEach(() => {
    variableDeclarator = createAstNode('VariableDeclarator', {
      id: createAstNode('Identifier', {name: 'name'}),
      init: createAstNode('Expression')
    })
    sandbox.stub(esprimaParser, 'getNameFromPattern')
      .returns(variables)
    sandbox.stub(esprimaParser, 'getInitValues')
      .returns(values)
    sandbox.stub(esprimaParser, 'isNeededToSet')
    sandbox.stub(esprimaParser, 'setVariables')
  })

  it('should call getNameFromPattern with id', () => {
    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(variableDeclarator.id)
    ).to.be.true
  })

  it('should call getInitValues with init', () => {
    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.getInitValues
        .calledWithExactly(variableDeclarator.init)
    ).to.be.true
  })

  it('should call setVariables with variables and values given isNeededToSet called with variables and init returns true', () => {
    esprimaParser.isNeededToSet
      .withArgs(variables, variableDeclarator.init)
        .returns(true)

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.setVariables
        .calledWithExactly(variables, values)
    ).to.be.true
  })

  it('should not call setVariables given isNeededToSet called with variables and init returns false', () => {
    esprimaParser.isNeededToSet
      .withArgs(variables, variableDeclarator.init)
        .returns(false)

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(esprimaParser.setVariables.called).to.be.false
  })
})
