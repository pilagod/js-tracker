'use strict'

// spec: https://github.com/estree/estree/blob/bc34a7cc861640aa8ee18d93186720be1b13db53/spec.md#unaryoperator

describe('UnaryOperator tests', () => {
  let getUnaryOperationResult

  before(() => {
    getUnaryOperationResult = (operator, argument) => {
      switch (operator) {
        case '-':
          return -argument
        case '+':
          return +argument
        case '!':
          return !argument
        case '~':
          return ~argument
        case 'typeof':
          return typeof argument
        case 'void':
          return undefined
        default:
      }
    }
  })

  for (const operator of ['-', '+', '!', '~', 'typeof', 'void']) {
    describe(`\'${operator}\' operator tests`, () => {
      it('should return correct result', () => {
        for (const argument of ['string', 1, true, null, undefined]) {
          const result = esprimaParser.unaryOperator[operator](argument)

          expect(result).to.be.eql(getUnaryOperationResult(operator, argument))
        }
      })
    })
  }

  describe('delete operator tests', () => {
    // @TODO: identifier -> check if window has that value
    // @TODO: array -> directly delete
    // @TODO: member -> get ref first (executeExpression)
  })
})
