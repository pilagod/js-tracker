// spec: https://github.com/estree/estree/blob/master/spec.md#blockstatement

describe('BlockStatement tests', () => {
  let blockStatement

  beforeEach(() => {
    blockStatement = createAstNode('BlockStatement', {
      body: ['statement1', 'statement2', 'statement3']
    })

    sandbox.stub(esprimaParser, 'parseStatementBody', () => {
      return 'resultFromParseBlockStatementBody'
    })
  })

  it('should call parseStatementBody with body and return the result', () => {
    const result = esprimaParser.BlockStatement(blockStatement)

    expect(
      esprimaParser.parseStatementBody
        .calledWithExactly(blockStatement.body)
    )
    expect(result).to.be.equal('resultFromParseBlockStatementBody')
  })
})
