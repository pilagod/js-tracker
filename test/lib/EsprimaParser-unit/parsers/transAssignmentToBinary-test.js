describe('transAssignmentToBinary tests', () => {
  let assignmentExpression

  beforeEach(() => {
    assignmentExpression = createAstNode('AssignmentExpression', {
      operator: 'binaryOperator=',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })
  })

  it('should return an BinaryExpression with replaced operator from assignmentOperator to binaryOperator', () => {
    const result = esprimaParser.transAssignmentToBinary(assignmentExpression)

    expect(result).to.be.eql({
      type: 'BinaryExpression',
      operator: 'binaryOperator',
      left: assignmentExpression.left,
      right: assignmentExpression.right
    })
  })
})
