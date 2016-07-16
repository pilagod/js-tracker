// spec: https://github.com/estree/estree/blob/master/spec.md#updateexpression
// assume always prefix
describe('UpdateExpression tests', () => {
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
    esprimaParser.UpdateExpression(updateExpression)

    expect(
      esprimaParser.transformUpdateToAssignment
        .calledWithExactly(updateExpression)
    ).to.be.true
  })

  it('should call AssignmentExpression with transformed expression', () => {
    esprimaParser.UpdateExpression(updateExpression)

    expect(
      esprimaParser.AssignmentExpression
        .calledWithExactly('resultFromTransformUpdateToAssignment')
    ).to.be.true
  })

  it('should return origin value given prefix false', () => {
    updateExpression.prefix = false

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())

    const result = esprimaParser.UpdateExpression(updateExpression)

    expect(result).to.be.equal('parsedExpression')
  })

  it('should return after-assignment value given prefix true', () => {
    updateExpression.prefix = true

    const result = esprimaParser.UpdateExpression(updateExpression)

    expect(result).to.be.equal('resultFromAssignmentExpression')
  })
})
