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
    sandbox.stub(esprimaParser, 'handleHoisting')
    sandbox.stub(esprimaParser, 'parseStatements')
  })

  it('should call handleHoisting with body', () => {
    esprimaParser.Program(program)

    expect(
      esprimaParser.handleHoisting
        .calledWithExactly(program.body)
    ).to.be.true
  })

  it('should call parseStatements with body after handleHoisting', () => {
    esprimaParser.Program(program)

    expect(
      esprimaParser.parseStatements
        .calledAfter(esprimaParser.handleHoisting)
    ).to.be.true
    expect(
      esprimaParser.parseStatements
        .calledWithExactly(program.body)
    ).to.be.true
  })
})
