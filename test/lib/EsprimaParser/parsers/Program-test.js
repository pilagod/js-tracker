// spec: https://github.com/estree/estree/blob/master/spec.md#programs

describe('Program tests', () => {
  let program

  beforeEach(() => {
    program = createAstNode('Program', {
      body: [
        createAstNode('Statement1'),
        createAstNode('Statement2'),
        createAstNode('Statement3')
      ]
    })

    sandbox.stub(esprimaParser, 'parseNode')
  })

  it('should call parseNode with nodes in body', () => {
    esprimaParser.Program(program)

    program.body.forEach((node) => {
      expect(
        esprimaParser.parseNode
          .calledWithExactly(node)
      ).to.be.true
    })
    expect(esprimaParser.parseNode.calledThrice).to.be.true
  })
})
