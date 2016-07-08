'use strict'

describe('AssignmentExpression tests', () => {
  let assignmentExpression

  beforeEach(() => {
    assignmentExpression = createAstNode('AssignmentExpression', {
      operator: 'binaryOperator=',
      left: createAstNode(),
      right: createAstNode()
    })

    sandbox.stub(esprimaParser, 'BinaryExpression', sandbox.spy(() => {
      return 'resultFromBinaryExpression'
    }))
    sandbox.stub(esprimaParser, 'handleAssignment', sandbox.spy())
  })

  it('should call BinaryExpression with replaced operator', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(assignmentExpression.operator).to.be.equal('binaryOperator')
    expect(
      esprimaParser.BinaryExpression
        .calledWithExactly(assignmentExpression)
    )
  })

  it('should call handleAssignment with left and new value', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.handleAssignment
        .calledWithExactly(assignmentExpression.left, 'resultFromBinaryExpression')
    ).to.be.true
  })

  it('should return result from BinaryExpression', () => {
    const result = esprimaParser.AssignmentExpression(assignmentExpression)

    expect(result).to.be.equal('resultFromBinaryExpression')
  })
})
