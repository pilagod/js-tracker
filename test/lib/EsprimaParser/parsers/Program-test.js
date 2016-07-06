'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#programs

describe('Program tests', () => {
  let program

  beforeEach(() => {
    program = createAstNode('Program')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy())
  })

  it('should call parseNode on nodes in body', () => {
    program.body = [
      {type: 'VariableDeclaration'},
      {type: 'FunctionDeclaration'},
      {type: 'ExpressionStatement'}
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
