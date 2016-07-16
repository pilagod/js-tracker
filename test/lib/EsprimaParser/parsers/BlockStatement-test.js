// spec: https://github.com/estree/estree/blob/master/spec.md#blockstatement

describe('BlockStatement tests', () => {
  let blockStatement

  beforeEach(() => {
    blockStatement = createAstNode('BlockStatement', {
      body: ['statement1', 'statement2', 'statement3']
    })

    sandbox.stub(esprimaParser, 'parseStatements', () => {
      return 'resultFromParseBlockStatements'
    })
  })

  it('should call parseStatementBody with body and return the result', () => {
    const result = esprimaParser.BlockStatement(blockStatement)

    expect(
      esprimaParser.parseStatements
        .calledWithExactly(blockStatement.body)
    )
    expect(result).to.be.equal('resultFromParseBlockStatements')
  })
})
