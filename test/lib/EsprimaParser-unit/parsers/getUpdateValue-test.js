describe('getUpdateValue tests', () => {
  let updateExpression

  beforeEach(() => {
    updateExpression = createAstNode('UpdateExpression', {
      operator: 'updateOperator',
      argument: createAstNode('Expression'),
      prefix: 'boolean'
    })

    sandbox.stub(esprimaParser, 'transUpdateToAssignment')
      .returns('resultFromTransUpdateToAssignment')
    sandbox.stub(esprimaParser, 'AssignmentExpression')
      .returns('resultFromAssignmentExpression')
  })

  it('should call transUpdateToAssignment with updateExpression', () => {
    esprimaParser.getUpdateValue(updateExpression)

    expect(
      esprimaParser.transUpdateToAssignment
        .calledWithExactly(updateExpression)
    ).to.be.true
  })

  it('should return result from AssignmentExpression called with result from transUpdateToAssignment', () => {
    const result = esprimaParser.getUpdateValue(updateExpression)

    expect(
      esprimaParser.AssignmentExpression
        .calledWithExactly('resultFromTransUpdateToAssignment')
    ).to.be.true
    expect(result).to.be.equal('resultFromAssignmentExpression')
  })
})
