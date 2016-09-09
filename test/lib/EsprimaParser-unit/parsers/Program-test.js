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
    sandbox.stub(esprimaParser, 'parseStatements')
  })

  it('should call parseStatements with body', () => {
    esprimaParser.Program(program)

    expect(esprimaParser.parseStatements.calledOnce).to.be.true
    expect(
      esprimaParser.parseStatements
        .calledWithExactly(program.body)
    ).to.be.true
  })
})
