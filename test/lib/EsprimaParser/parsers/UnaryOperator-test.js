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
    describe(`\'${operator}\' operator test`, () => {
      it('should return correct result', () => {
        for (const argument of ['string', 1, true, null, undefined]) {
          const result = esprimaParser.unaryOperators[operator](argument)

          expect(result).to.be.eql(getUnaryOperationResult(operator, argument))
        }
      })
    })
  }

  describe('delete operator tests', () => {
    // case object
    it('should delete object property given property name', () => {
      const object = {a: 'delete property'}
      const property = 'a'

      const result = esprimaParser.unaryOperators.delete(object, property)

      expect(object).to.be.eql({})
      expect(result).to.be.true
    })

    it('should do nothing given non-existing property of object', () => {
      const object = {b: 'should not delete this'}
      const property = 'a'

      const result = esprimaParser.unaryOperators.delete(object, property)

      expect(object).to.be.eql({b: 'should not delete this'})
      expect(result).to.be.true
    })

    // case array
    it('should delete array element given index', () => {
      const array = [1, 2, 3]
      const index = 1

      const result = esprimaParser.unaryOperators.delete(array, index)

      expect(array[1]).to.be.undefined
      expect(result).to.be.true
    })

    it('should do nothing given non-existing index of array', () => {
      const array = [1, 2, 3]
      const index = 3

      const result = esprimaParser.unaryOperators.delete(array, index)

      expect(array).to.be.eql([1, 2, 3])
      expect(result).to.be.true
    })
  })
})
