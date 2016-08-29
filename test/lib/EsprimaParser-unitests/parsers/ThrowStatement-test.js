// spec: https://github.com/estree/estree/blob/master/spec.md#throwstatement

describe('ThrowStatement tests', () => {
  let throwStatement

  beforeEach(() => {
    throwStatement = createAstNode('ThrowStatement', {
      argument: createAstNode('Expression')
    })

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should throw with the result from parseNode called with argument', () => {
    expect(
      esprimaParser.ThrowStatement.bind(esprimaParser, throwStatement)
    ).to.throw('parsedExpression')
  })
})
