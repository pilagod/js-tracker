describe('handleReferenceOperation tests', () => {
  const args = ['arg1', 'arg2', 'arg3']
  const operation = () => {}

  it('should call handleMemberReferenceOperation with all arguments passed given MemberExpression argument and return', () => {
    const argument = createAstNode('MemberExpression')

    sandbox.stub(esprimaParser, 'handleMemberReferenceOperation')
      .returns('resultFromHandleMemberReferenceOperation')

    const result = esprimaParser.handleReferenceOperation(argument, operation, ...args)

    expect(
      esprimaParser.handleMemberReferenceOperation
        .calledWithExactly(argument, operation, ...args)
    ).to.be.true
    expect(result).to.be.equal('resultFromHandleMemberReferenceOperation')
  })

  it('should call handlePatternReferenceOperation with all arguments passed given Pattern argument and return', () => {
    const argument = createAstNode('Pattern')

    sandbox.stub(esprimaParser, 'handlePatternReferenceOperation')
      .returns('handlePatternReferenceOperation')

    const result = esprimaParser.handleReferenceOperation(argument, operation, ...args)

    expect(
      esprimaParser.handlePatternReferenceOperation
        .calledWithExactly(argument, operation, ...args)
    ).to.be.true
    expect(result).to.be.equal('handlePatternReferenceOperation')
  })
})
