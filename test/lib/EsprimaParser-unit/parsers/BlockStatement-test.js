// spec: https://github.com/estree/estree/blob/master/spec.md#blockstatement

describe('BlockStatement tests', () => {
  let blockStatement

  beforeEach(() => {
    blockStatement = createAstNode('BlockStatement', {
      body: [
        createAstNode('Statement1'),
        createAstNode('Statement2'),
        createAstNode('Statement3')
      ]
    })

    sandbox.stub(esprimaParser, 'parseStatements')
      .returns('resultFromParseStatements')
  })

  it('should call parseStatementBody with body and return the result', () => {
    const result = esprimaParser.BlockStatement(blockStatement)

    expect(
      esprimaParser.parseStatements
        .calledWithExactly(blockStatement.body)
    )
    expect(result).to.be.equal('resultFromParseStatements')
  })
})
