describe('handleMemberReferenceOperation tests', () => {
  const parseExpressionStub = {
    data: 'data',
    info: 'info'
  }
  const getReferenceStub = {
    object: 'object',
    property: 'property'
  }
  const args = ['arg1', 'arg2', 'arg3']
  let memberExpression, operationStub

  beforeEach(() => {
    memberExpression = createAstNode('MemberExpression')
    operationStub = sandbox.stub().returns('resultFromOperation')

    sandbox.stub(esprimaParser, 'parseExpression')
      .returns(parseExpressionStub)
    sandbox.stub(esprimaParser, 'getReference')
      .returns(getReferenceStub)
  })

  it('should call parseExpression with memberExpression', () => {
    esprimaParser.handleMemberReferenceOperation(memberExpression, operationStub, ...args)

    expect(
      esprimaParser.parseExpression
        .calledWithExactly(memberExpression)
    ).to.be.true
  })

  it('should call getReference with data from result object of parseExpression', () => {
    esprimaParser.handleMemberReferenceOperation(memberExpression, operationStub, ...args)

    expect(
      esprimaParser.getReference
        .calledWithExactly(parseExpressionStub.data)
    ).to.be.true
  })

  it('should call operation with result from getReference concated with expression info and remaining args and return', () => {
    const result = esprimaParser.handleMemberReferenceOperation(memberExpression, operationStub, ...args)

    expect(
      operationStub
        .calledWithExactly({
          object: 'object',
          property: 'property',
          info: 'info'
        }, ...args)
    ).to.be.true
    expect(result).to.be.equal('resultFromOperation')
  })
})
