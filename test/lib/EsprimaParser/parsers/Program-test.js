'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#programs

describe('Program tests', () => {
  let program

  beforeEach(() => {
    program = createAstNode('Program')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy())
  })

  it('should call parseNode with nodes in body', () => {
    program.body = [
      createAstNode('VariableDeclaration'),
      createAstNode('FunctionDeclaration'),
      createAstNode('ExpressionStatement')
    ]

    esprimaParser.Program(program)

    program.body.forEach((node) => {
      expect(
        esprimaParser.parseNode
          .calledWithExactly(node)
      ).to.be.true
    })
  })
})
