describe('handleReferenceOperation tests', () => {
  let argument, remainingArgs, operationSpy

  before(() => {
    remainingArgs = [1, 'string', true, null, undefined]
  })

  beforeEach(() => {
    operationSpy = sandbox.spy(() => 'resultFromOperation')
  })

  // case Identifier -> call operation with reference property and remaining arguments
  describe('Identifier argument', () => {
    beforeEach(() => {
      argument = createAstNode('Identifier', {name: 'a'})
    })

    it('should call operation with {property: \'a\'} and remaining arguments', () => {
      esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(
        operationSpy
          .calledWithExactly({property: 'a'}, ...remainingArgs)
      ).to.be.true
    })

    it('should return the result from operation', () => {
      const result = esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

      expect(result).to.be.equal('resultFromOperation')
    })
  })

  // case MemberExpression -> call parse${type},
  //                       -> call getReference to get object and property,
  //                       -> call operation with reference and remaining arguments
  describe('MemberExpression and CallExpression', () => {
    const referenceStub = {
      object: {'b': 'operated property'},
      property: 'b'
    }
    let expression

    before(() => {
      class Expression {
        getReference() {
          return referenceStub
        }
      }
      expression = new Expression()
    })

    beforeEach(() => {
      sandbox.spy(expression, 'getReference')
    })

    for (const type of ['MemberExpression', 'CallExpression']) {
      describe(`${type} argument`, () => {
        beforeEach(() => {
          argument = createAstNode(type)

          sandbox.stub(esprimaParser, `parseExpression`, sandbox.spy(() => {
            return expression
          }))
        })

        it(`should call parseExpression with argument`, () => {
          esprimaParser.handleReferenceOperation(argument, operationSpy, ...[])

          expect(
            esprimaParser.parseExpression
              .calledWithExactly(argument)
          ).to.be.true
        })

        it('should call getReference of parsed expression', () => {
          esprimaParser.handleReferenceOperation(argument, operationSpy, ...[])

          expect(expression.getReference.calledOnce).to.be.true
        })

        it(`should call operation with referenceStub and remaining arguments`, () => {
          esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

          expect(
            operationSpy
              .calledWithExactly(referenceStub, ...remainingArgs)
          ).to.be.true
        })

        it('should return result from operation', () => {
          const result = esprimaParser.handleReferenceOperation(argument, operationSpy, ...remainingArgs)

          expect(result).to.be.equal('resultFromOperation')
        })
      })
    }
  })
})
