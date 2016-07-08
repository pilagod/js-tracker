'use strict'

describe('BinaryOperator tests', () => {
  let getBinaryOperatorResult

  before(() => {
    getBinaryOperatorResult = (left, right, operator) => {
      switch (operator) {
        case '==':
          return left == right
        case '!=':
          return left != right
        case '===':
          return left === right
        case '!==':
          return left !== right
        case '<':
          return left < right
        case '<=':
          return left <= right
        case '>':
          return left > right
        case '>=':
          return left >= right
        case '<<':
          return left << right
        case '>>':
          return left >> right
        case '>>>':
          return left >>> right
        case '+':
          return left + right
        case '-':
          return left - right
        case '*':
          return left * right
        case '/':
          return left / right
        case '%':
          return left % right
        case '|':
          return left | right
        case '^':
          return left ^ right
        case '&':
          return left & right
        case 'in':
          return left in right
        case 'instanceof':
          return left instanceof right
        default:
      }
    }
  })

  for (const operator of [
    "==", "!=", "===", "!==",
    "<", "<=", ">", ">=",
    "<<", ">>", ">>>",
    "+", "-", "*", "/", "%",
    "|", "^", "&"]
  ) {
    describe(`\'${operator}\' operator test`, () => {
      it('should return correct result', () => {
        for (const left of ['string', 1, true, null, undefined]) {
          for (const right of ['string', 1, true, null, undefined]) {
            const result = esprimaParser.binaryOperators[operator](left, right)

            expect(result).to.be.eql(getBinaryOperatorResult(left, right, operator))
          }
        }
      })
    })
  }

  describe('\'in\' operator test', () => {
    it('should return correct result given left an object', () => {
      const mycar = {make: "Honda", model: "Accord", year: 1998};

      expect(esprimaParser.binaryOperators.in('make', mycar)).to.be.true
      expect(esprimaParser.binaryOperators.in('model', mycar)).to.be.true
      expect(esprimaParser.binaryOperators.in('month', mycar)).to.be.false

      delete mycar.make
      expect(esprimaParser.binaryOperators.in('make', mycar)).to.be.false
    })

    it('should return correct result given left an array', () => {
      const trees = ["redwood", "bay", "cedar", "oak", "maple"];

      expect(esprimaParser.binaryOperators.in(0, trees)).to.be.true
      expect(esprimaParser.binaryOperators.in(3, trees)).to.be.true
      expect(esprimaParser.binaryOperators.in(6, trees)).to.be.false
      expect(esprimaParser.binaryOperators.in('bay', trees)).to.be.false
      expect(esprimaParser.binaryOperators.in('length', trees)).to.be.true

      delete trees[3];
      expect(esprimaParser.binaryOperators.in(3, trees)).to.be.false
    })
  })

  describe('\'instanceof\' operator test', () => {
    it('should return correct result', () => {
      const simpleStr = 'This is a simple string';
      const myString = new String();
      const myDate = new Date();
      const myObj = {};

      expect(esprimaParser.binaryOperators.instanceof(simpleStr, String)).to.be.false
      expect(esprimaParser.binaryOperators.instanceof(myString, String)).to.be.true
      expect(esprimaParser.binaryOperators.instanceof(myString, Object)).to.be.true
      expect(esprimaParser.binaryOperators.instanceof(myString, Date)).to.be.false

      expect(esprimaParser.binaryOperators.instanceof(myObj, Object)).to.be.true

      expect(esprimaParser.binaryOperators.instanceof(myDate, Date)).to.be.true
      expect(esprimaParser.binaryOperators.instanceof(myDate, String)).to.be.false
      expect(esprimaParser.binaryOperators.instanceof(myDate, Object)).to.be.true
    })
  })
})
