describe('AssignmentExpression tests', () => {
  let assignmentExpression

  beforeEach(() => {
    assignmentExpression = createAstNode('AssignmentExpression', {
      operator: 'binaryOperator=',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })

    sandbox.stub(esprimaParser, 'BinaryExpression')
      .returns('resultFromBinaryExpression')
    sandbox.stub(esprimaParser, 'handleReferenceOperation')
  })

  it('should call BinaryExpression with assignmentExpression whose operator has been replaced', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(assignmentExpression.operator).to.be.equal('binaryOperator')
    expect(
      esprimaParser.BinaryExpression
        .calledWithExactly(assignmentExpression)
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
