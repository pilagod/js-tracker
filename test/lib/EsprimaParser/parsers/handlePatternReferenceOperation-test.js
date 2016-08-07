describe('handlePatternReferenceOperation tests', () => {
  const args = ['arg1', 'arg2', 'arg3']
  let pattern, operationStub

  beforeEach(() => {
    pattern = createAstNode('Pattern')
    operationStub = sandbox.stub().returns('resultFromOperation')

    sandbox.stub(esprimaParser, 'getNameFromPattern')
      .returns('resultFromGetNameFromPattern')
  })

  it('should call getNameFromPattern with pattern', () => {
    esprimaParser.handlePatternReferenceOperation(pattern, operationStub, ...args)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(pattern)
    ).to.be.true
  })

  it('should call operation with {property: ${resultFromGetNameFromPattern}} and remaining args and return', () => {
    const result =
      esprimaParser.handlePatternReferenceOperation(pattern, operationStub, ...args)

    expect(
      operationStub
        .calledWithExactly({
          property: 'resultFromGetNameFromPattern'
        }, ...args)
    ).to.be.true
    expect(result).to.be.equal('resultFromOperation')
  })
})
