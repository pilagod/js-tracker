'use strict'

describe('handleDeleteUnaryOperation tests', () => {
  let argument, deleteOperationSpy

  beforeEach(() => {
    deleteOperationSpy = sandbox.spy(() => 'resultFromDeleteOperation')
  })

  // case Identifier -> delete property from window
  describe('Identifier argument tests', () => {
    let windowStub

    beforeEach(() => {
      windowStub = {}
      argument = createAstNode('Identifier', {name: 'a'})

      sandbox.stub(esprimaParser, 'closureStack', {
        get: sandbox.spy(() => windowStub)
      })
    })

    it('should get window reference', () => {
      esprimaParser.handleDeleteUnaryOperation(argument, deleteOperationSpy)

      expect(
        esprimaParser.closureStack.get
          .calledWithExactly('window')
      ).to.be.true
    })

    it('should call delete operation with window and name', () => {
      esprimaParser.handleDeleteUnaryOperation(argument, deleteOperationSpy)

      expect(
        deleteOperationSpy
          .calledWithExactly(windowStub, 'a')
      ).to.be.true
    })

    it('should return result from delete operation', () => {
      const result = esprimaParser.handleDeleteUnaryOperation(argument, deleteOperationSpy)

      expect(result).to.be.equal('resultFromDeleteOperation')
    })
  })

  // case MemberExpression -> call parseMemberExpression,
  //                       -> executeExpression to get object,
  //                       -> delete property from object
  describe('MemberExpression argument tests', () => {
    let expression

    before(() => {
      class Expression {
        getReference() {}
      }
      expression = new Expression()
    })

    beforeEach(() => {
      argument = createAstNode('MemberExpression')

      sandbox.stub(esprimaParser, 'parseMemberExpression', sandbox.spy(() => {
        return expression
      }))
      sandbox.stub(expression, 'getReference', sandbox.spy(() => {
        return {
          object: {
            'b': 'delete property'
          },
          property: 'b'
        }
      }))
    })

    it('should call parseMemberExpression with argument', () => {
      esprimaParser.handleDeleteUnaryOperation(argument, deleteOperationSpy)

      expect(
        esprimaParser.parseMemberExpression
          .calledWithExactly(argument)
      ).to.be.true
    })

    it('should call delete operation with object and property from result of parseMemberExpression', () => {
      esprimaParser.handleDeleteUnaryOperation(argument, deleteOperationSpy)

      expect(
        deleteOperationSpy
          .calledWithExactly({b: 'delete property'}, 'b')
      ).to.be.true
    })

    it('should return result from delete operation', () => {
      const result = esprimaParser.handleDeleteUnaryOperation(argument, deleteOperationSpy)

      expect(result).to.be.equal('resultFromDeleteOperation')
    })
  })

  // case Other -> retrun true only
  describe('Other argument tests', () => {
    it('should always return true', () => {
      argument = createAstNode()

      const result = esprimaParser.handleDeleteUnaryOperation(argument, null)

      expect(result).to.be.true
    })
  })
})
