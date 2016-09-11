describe('AssignmentExpression tests', () => {
  let assignmentExpression, assignSpy
  // stub results
  const value = 'value'
  const reference = {
    caller: {},
    callee: 'callee'
  }
  beforeEach(() => {
    assignmentExpression = createAstNode('AssignmentExpression', {
      operator: 'assignmentOperator',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })
    assignSpy = sandbox.spy()

    sandbox.stub(esprimaParser, 'getAssignValue')
      .returns(value)
    sandbox.stub(esprimaParser, 'getReference')
      .returns(reference)
    sandbox.stub(esprimaParser.assignmentOperators, '=', assignSpy)
  })

  it('should call getAssignValue with assignmentExpression', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.getAssignValue
        .calledWithExactly(assignmentExpression)
    ).to.be.true
  })

  it('should call getReference with assignmentExpression.left', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.getReference
        .calledWithExactly(assignmentExpression.left)
    ).to.be.true
  })

  it('should call assign operation with reference (from getReference) and value (from getAssignValue)', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      assignSpy
        .calledWithExactly(reference, value)
    ).to.be.true
  })

  it('should return result from getAssignValue', () => {
    const result = esprimaParser.AssignmentExpression(assignmentExpression)

    expect(result).to.be.equal(value)
  })
})
