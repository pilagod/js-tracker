// spec: https://github.com/estree/estree/blob/master/spec.md#updateexpression

describe('UpdateExpression tests', () => {
  let updateExpression

  // prefix
  beforeEach(() => {
    updateExpression = createAstNode('UpdateExpression')

    sandbox.stub(esprimaParser, 'transformUpdateToAssignment', sandbox.spy(() => {
      return 'transformedExpression'
    }))
    sandbox.stub(esprimaParser, 'AssignmentExpression', sandbox.spy(() => {
      return 'after-assignment value'
    }))
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
        .calledWithExactly('transformedExpression')
    ).to.be.true
  })

  it('should return origin value given prefix false', () => {
    updateExpression.prefix = false

    sandbox.stub(esprimaParser, 'parseNode', () => 'argument value')

    const result = esprimaParser.UpdateExpression(updateExpression)

    expect(result).to.be.equal('argument value')
  })

  it('should return after-assignment value given prefix true', () => {
    updateExpression.prefix = true

    const result = esprimaParser.UpdateExpression(updateExpression)

    expect(result).to.be.equal('after-assignment value')
  })
})
