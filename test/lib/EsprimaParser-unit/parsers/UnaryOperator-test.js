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
    describe(`'${operator}' operator`, () => {
      it('should return correct result', () => {
        for (const argument of ['string', 1, true, null, undefined]) {
          const result = esprimaParser.unaryOperators[operator](argument)

          expect(result).to.be.eql(getUnaryOperationResult(operator, argument))
        }
      })
    })
  }

  describe('delete operator', () => {
    let target

    // case Identifier
    describe('Identifier', () => {
      let windowStub

      beforeEach(() => {
        windowStub = {
          a: 'delete property'
        }
        sandbox.stub(esprimaParser, 'context', windowStub)
      })

      it('should delete global property callee given no caller referecne', () => {
        target = {callee: 'a'}

        const result = esprimaParser.unaryOperators.delete(target)

        expect(windowStub).to.be.eql({})
        expect(result).to.be.true
      })

      it('should do nothing given non-existing property callee of global', () => {
        target = {callee: 'b'}

        const result = esprimaParser.unaryOperators.delete(target)

        expect(windowStub).to.be.eql({a: 'delete property'})
        expect(result).to.be.true
      })
    })

    describe('Object', () => {
      beforeEach(() => {
        target = {
          caller: {a: 'delete property'}
        }
      })

      it('should delete caller property given property callee name', () => {
        target.callee = 'a'

        const result = esprimaParser.unaryOperators.delete(target)

        expect(target.caller).to.be.eql({})
        expect(result).to.be.true
      })

      it('should do nothing given non-existing property callee of caller', () => {
        target.callee = 'b'

        const result = esprimaParser.unaryOperators.delete(target)

        expect(target.caller).to.be.eql({a: 'delete property'})
        expect(result).to.be.true
      })
    })

    describe('Array', () => {
      beforeEach(() => {
        target = {
          caller: [1, 2, 3]
        }
      })

      it('should delete array caller\'s element given index callee', () => {
        target.callee = 1

        const result = esprimaParser.unaryOperators.delete(target)

        expect(target.caller[1]).to.be.undefined
        expect(result).to.be.true
      })

      it('should do nothing given non-existing index callee of array caller', () => {
        target.callee = 3

        const result = esprimaParser.unaryOperators.delete(target)

        expect(target.caller).to.be.eql([1, 2, 3])
        expect(result).to.be.true
      })
    })
  })
})
