describe('AssignmentExpression tests', () => {
  let assignmentExpression, assignStub
  // stub results
  const value = 'value'
  const exp = {
    caller: {},
    callee: 'callee'
  }
  const info = {}

  beforeEach(() => {
    delete exp.info // init exp

    assignmentExpression = createAstNode('AssignmentExpression', {
      operator: 'assignmentOperator',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })
    assignStub = sandbox.stub().returns('resultFromAssign')

    sandbox.stub(esprimaParser, 'getAssignValue').returns(value)
    sandbox.stub(esprimaParser, 'getRefExp').returns(exp)
    sandbox.stub(esprimaParser, 'getExpInfo').returns(info)
    sandbox.stub(esprimaParser, 'assignmentOperators', {
      '=': assignStub
    })
  })

  it('should call getAssignValue with assignmentExpression', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.getAssignValue
        .calledWithExactly(assignmentExpression)
    ).to.be.true
  })

  it('should call getRefExp with assignmentExpression.left', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.getRefExp
        .calledWithExactly(assignmentExpression.left)
    ).to.be.true
  })

  it('should set exp.info to result from getExpInfo called with assignmentExpression', () => {
    esprimaParser.AssignmentExpression(assignmentExpression)

    expect(
      esprimaParser.getExpInfo
        .calledWithExactly(assignmentExpression)
    ).to.be.true
    expect(exp.info).to.be.equal(info)
  })

  it('should call assign operation with exp (from getRefExp, after assigned info) and value (from getAssignValue) then return', () => {
    const result = esprimaParser.AssignmentExpression(assignmentExpression)

    expect(exp.info).to.be.equal(info)
    expect(
      assignStub
        .calledWithExactly(exp, value)
    ).to.be.true
    expect(result).to.be.equal('resultFromAssign')
  })
})
