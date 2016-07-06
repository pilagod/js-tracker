'use strict'

// spec: https://github.com/estree/estree/blob/master/spec.md#expressionstatement

describe('ExpressionStatement tests', () => {
  let expressionStatement

  beforeEach(() => {
    expressionStatement = createAstNode('ExpressionStatement')

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy())
  })

  it('should call parseNode on expression', () => {
    expressionStatement.expression = createAstNode('Literal')

    esprimaParser.ExpressionStatement(expressionStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(expressionStatement.expression)
    ).to.be.true
  })
})
