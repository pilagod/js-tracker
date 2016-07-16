// spec: https://github.com/estree/estree/blob/master/spec.md#expressionstatement

describe('ExpressionStatement tests', () => {
  let expressionStatement

  beforeEach(() => {
    expressionStatement = createAstNode('ExpressionStatement', {
      expression: createAstNode('Expression')
    })

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should call parseNode with expression', () => {
    esprimaParser.ExpressionStatement(expressionStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(expressionStatement.expression)
    ).to.be.true
  })
})
