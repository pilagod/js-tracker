// spec: https://github.com/estree/estree/blob/master/spec.md#logicaloperator

describe('LogicalOperator tests', () => {
  let getLogicalOperatorResult

  before(() => {
    getLogicalOperatorResult = (left, right, operator) => {
      switch (operator) {
        case '||':
          return left || right
        case '&&':
          return left && right
        default:
      }
    }
  })

  for (const operator of ['||', '&&']) {
    describe(`'${operator}' operator test`, () => {
      it('should return correct result', () => {
        for (const left of ['string', 1, true, null, undefined]) {
          for (const right of ['string', 1, true, null, undefined]) {
            const result = esprimaParser.logicalOperators[operator](left, right)

            expect(result).to.be.eql(getLogicalOperatorResult(left, right, operator))
          }
        }
      })
    })
  }
})
