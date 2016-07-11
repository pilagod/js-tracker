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
    sandbox.stub(esprimaParser, 'handleReferenceOperation', sandbox.spy())
  })

  it('should call BinaryExpression with replaced operator', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(assignmentExpression.operator).to.be.equal('binaryOperator')
    expect(
      esprimaParser.BinaryExpression
        .calledWithExactly(assignmentExpression)
    )
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
