describe('AssignmentExpression tests', () => {
  let assignmentExpression

  beforeEach(() => {
    assignmentExpression = createAstNode('AssignmentExpression', {
      operator: 'assignmentOperator',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })

    sandbox.stub(esprimaParser, 'getAssignmentValue')
      .returns('resultFromGetAssignmentValue')
    sandbox.stub(esprimaParser, 'handleReferenceOperation')
  })

  it('should call getAssignmentValue with assignmentExpression', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.getAssignmentValue
        .calledWithExactly(assignmentExpression)
    ).to.be.true
  })

  // it('should call transformAssignmentToBinary with assignmentExpression', () => {
  //   esprimaParser.AssignmentExpression(assignmentExpression)
  //
  //   expect(
  //     esprimaParser.transformAssignmentToBinary
  //       .calledWithExactly(assignmentExpression)
  //   ).to.be.true
  // })
  //
  // it('should call BinaryExpression with result from transformAssignmentToBinary', () => {
  //   esprimaParser.AssignmentExpression(assignmentExpression)
  //
  //   expect(
  //     esprimaParser.BinaryExpression
  //       .calledWithExactly('resultFromTransformAssignmentToBinary')
  //   ).to.be.true
  // })

  it('should call handleReferenceOperation with left, handleAssignment and result from getAssignmentValue', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.handleReferenceOperation
        .calledWithExactly(
          assignmentExpression.left,
          esprimaParser.assignmentOperators['='],
          'resultFromGetAssignmentValue'
        )
    ).to.be.true
  })

  it('should return result from getAssignmentValue', () => {
    const result = esprimaParser.AssignmentExpression(assignmentExpression)

    expect(result).to.be.equal('resultFromGetAssignmentValue')
  })
})
