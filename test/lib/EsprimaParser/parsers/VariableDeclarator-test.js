'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#variabledeclarator

describe('VariableDeclarator tests', () => {
  let variableDeclarator

  beforeEach(() => {
    variableDeclarator = createAstNode('VariableDeclarator')
    variableDeclarator.id = createAstNode('Identifier', {name: 'a'})

    sandbox.stub(esprimaParser, 'closureStack', {
      set: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'parseNode', createLiteralStub())
  })

  it('should call parseNode with init given non-null init', () => {
    variableDeclarator.init = createAstNode('Literal')

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(variableDeclarator.init)
    ).to.be.true
  })

  it('should call set of closureStack with id name and init value, given non-null init', () => {
    variableDeclarator.init = createAstNode('Literal', {value: 1})

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.closureStack.set
        .calledWithExactly('a', 1)
    ).to.be.true
  })

  it('should not call parseNode with init given null init', () => {
    variableDeclarator.init = null

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(esprimaParser.parseNode.callCount).to.be.equal(0)
  })

  it('should call set of closureStack with id name and undefined, given null init', () => {
    variableDeclarator.init = null

    esprimaParser.VariableDeclarator(variableDeclarator)

    expect(
      esprimaParser.closureStack.set
        .calledWithExactly('a', undefined)
    ).to.be.true
  })
})
