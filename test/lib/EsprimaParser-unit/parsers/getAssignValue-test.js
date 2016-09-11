describe('getAssignValue tests', () => {
  const binaryExpressionStub = {
    left: 'left',
    right: 'right'
  }
  let assignmentExpression

  beforeEach(() => {
    assignmentExpression = createAstNode('AssignmentExpression', {
      operator: 'assignmentOperator',
      left: createAstNode('ExpressionLeft'),
      right: createAstNode('ExpressionRight')
    })

    sandbox.stub(esprimaParser, 'transAssignmentToBinary')
      .returns(binaryExpressionStub)
    sandbox.stub(esprimaParser, 'BinaryExpression')
      .returns('resultFromBinaryExpression')
    sandbox.stub(esprimaParser, 'parseNode')
      .returns('resultFromParseNode')
  })

  it('should call transAssignmentToBinary with assignmentExpression', () => {
    esprimaParser.getAssignValue(assignmentExpression)

    expect(
      esprimaParser.transAssignmentToBinary
        .calledWithExactly(assignmentExpression)
    ).to.be.true
  })

  it('should return result from BinaryExpression called with result from transAssignmentToBinary given non-empty operator string', () => {
    binaryExpressionStub.operator = '+'

    const result = esprimaParser.getAssignValue(assignmentExpression)

    expect(
      esprimaParser.BinaryExpression
        .calledWithExactly(binaryExpressionStub)
    ).to.be.true
    expect(result).to.be.equal('resultFromBinaryExpression')
  })

  it('should return result from parseNode called with right of result from transAssignmentToBinary given empty operator string', () => {
    binaryExpressionStub.operator = ''

    const result = esprimaParser.getAssignValue(assignmentExpression)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(binaryExpressionStub.right)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseNode')
  })
})
