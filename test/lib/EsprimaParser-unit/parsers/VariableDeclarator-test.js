// spec: https://github.com/estree/estree/blob/master/spec.md#variabledeclarator

describe('VariableDeclarator tests', () => {
  const kind = 'var/let/const'
  let variableDeclarator

  beforeEach(() => {
    variableDeclarator = createAstNode('VariableDeclarator', {
      init: createAstNode('Expression')
    })
    sandbox.stub(esprimaParser, 'isVariableNeededToSet')
    sandbox.stub(esprimaParser, 'parseVariableDeclarator')
  })

  it('should call isVariableNeededToSet with kind and variableDeclarator.init', () => {
    esprimaParser.VariableDeclarator(variableDeclarator, kind)

    expect(
      esprimaParser.isVariableNeededToSet
        .calledWithExactly(kind, variableDeclarator.init)
    ).to.be.true
  })

  it('should call parseVariableDeclarator with variableDeclarator given isVariableNeededToSet returns true', () => {
    esprimaParser.isVariableNeededToSet.returns(true)

    esprimaParser.VariableDeclarator(variableDeclarator, kind)

    expect(
      esprimaParser.parseVariableDeclarator
        .calledWithExactly(variableDeclarator)
    ).to.be.true
  })

  it('should not call parseVariableDeclarator given isVariableNeededToSet returns false', () => {
    esprimaParser.isVariableNeededToSet.returns(false)

    esprimaParser.VariableDeclarator(variableDeclarator, kind)

    expect(esprimaParser.parseVariableDeclarator.called).to.be.false
  })
})
