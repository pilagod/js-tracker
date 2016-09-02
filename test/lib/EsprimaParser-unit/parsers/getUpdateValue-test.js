describe('getUpdateValue tests', () => {
  let updateExpression

  beforeEach(() => {
    updateExpression = createAstNode('UpdateExpression', {
      operator: 'updateOperator',
      argument: createAstNode('Expression'),
      prefix: 'boolean'
    })

    sandbox.stub(esprimaParser, 'transformUpdateToAssignment')
      .returns('resultFromTransformUpdateToAssignment')
    sandbox.stub(esprimaParser, 'AssignmentExpression')
      .returns('resultFromAssignmentExpression')
  })

  it('should call transformUpdateToAssignment with updateExpression', () => {
    esprimaParser.getUpdateValue(updateExpression)

    expect(
      esprimaParser.transformUpdateToAssignment
        .calledWithExactly(updateExpression)
    ).to.be.true
  })

  it('should return result from AssignmentExpression called with result from transformUpdateToAssignment', () => {
    const result = esprimaParser.getUpdateValue(updateExpression)

    expect(
      esprimaParser.AssignmentExpression
        .calledWithExactly('resultFromTransformUpdateToAssignment')
    ).to.be.true
    expect(result).to.be.equal('resultFromAssignmentExpression')
  })
})
