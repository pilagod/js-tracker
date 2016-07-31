describe('AssignmentExpression tests', () => {
  let assignmentExpression

  beforeEach(() => {
    assignmentExpression = createAstNode('AssignmentExpression', {
      operator: 'assignmentOperator',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })

    sandbox.stub(esprimaParser, 'transformAssignmentToBinary')
      .returns('resultFromTransformAssignmentToBinary')
    sandbox.stub(esprimaParser, 'BinaryExpression')
      .returns('resultFromBinaryExpression')
    sandbox.stub(esprimaParser, 'handleReferenceOperation')
  })

  it('should call transformAssignmentToBinary with assignmentExpression', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.transformAssignmentToBinary
        .calledWithExactly(assignmentExpression)
    ).to.be.true
  })

  it('should call BinaryExpression with result from transformAssignmentToBinary', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.BinaryExpression
        .calledWithExactly('resultFromTransformAssignmentToBinary')
    ).to.be.true
  })

  it('should call handleReferenceOperation with left, handleAssignment and new value', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.handleReferenceOperation
        .calledWithExactly(
          assignmentExpression.left,
          esprimaParser.assignmentOperators['='],
          'resultFromBinaryExpression'
        )
    ).to.be.true
  })

  it('should return result from BinaryExpression', () => {
    const result = esprimaParser.AssignmentExpression(assignmentExpression)

    expect(result).to.be.equal('resultFromBinaryExpression')
  })
})
