'use strict'

// spec: https://github.com/estree/estree/blob/bc34a7cc861640aa8ee18d93186720be1b13db53/spec.md#unaryexpression

describe('UnaryExpression tests', () => {
  let unaryExpression

  beforeEach(() => {
    unaryExpression = createAstNode('UnaryExpression', {
      argument: createAstNode(),
      operator: 'possibleOperator',
      prefix: true
    })

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => 'parsedArgument'))
    sandbox.stub(esprimaParser, 'unaryOperator', {
      'possibleOperator': sandbox.spy(() => 'resultFromOperation')
    })
  })

  it('should call parseNode with argument and pass result to operation', () => {
    esprimaParser.UnaryExpression(unaryExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(unaryExpression.argument)
    ).to.be.true
  })

  it('should pass parseNode result to operation', () => {
    esprimaParser.UnaryExpression(unaryExpression)

    expect(
      esprimaParser.unaryOperator.possibleOperator
        .calledWithExactly('parsedArgument')
    ).to.be.true
  })

  it('should return result of operation', () => {
    const result = esprimaParser.UnaryExpression(unaryExpression)

    expect(result).to.be.equal('resultFromOperation')
  })
})
