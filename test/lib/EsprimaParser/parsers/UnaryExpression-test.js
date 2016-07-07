'use strict'

// spec: https://github.com/estree/estree/blob/bc34a7cc861640aa8ee18d93186720be1b13db53/spec.md#unaryexpression

describe('UnaryExpression tests', () => {
  let unaryExpression

  beforeEach(() => {
    unaryExpression = createAstNode('UnaryExpression', {
      argument: createAstNode(),
      prefix: true
    })

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(() => 'parsedArgument'))
  })

  it('should call parseNode with argument and pass result to operation', () => {
    unaryExpression.operator = 'possibleOperator'

    sandbox.stub(esprimaParser, 'unaryOperator', {
      'possibleOperator': sandbox.spy(() => {})
    })

    esprimaParser.UnaryExpression(unaryExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(unaryExpression.argument)
    ).to.be.true
    expect(
      esprimaParser.unaryOperator.possibleOperator
        .calledWithExactly('parsedArgument')
    ).to.be.true
  })

  for (const operator of ['-', '+', '!', '~', 'typeof', 'void', 'delete']) {
    it(`should call operation \'${operator}\' given operator \'${operator}\' and return the result`, () => {
      unaryExpression.operator = operator

      sandbox.stub(esprimaParser, 'unaryOperator', {
        [operator]: () => operator
      })

      const result = esprimaParser.UnaryExpression(unaryExpression)

      expect(result).to.be.equal(operator)
    })
  }
})
