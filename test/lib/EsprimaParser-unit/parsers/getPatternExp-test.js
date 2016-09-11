describe('getPatternExp tests', () => {
  let pattern
  // stub results
  const patternName= 'patternName'

  beforeEach(() => {
    pattern = createAstNode('Pattern')

    sandbox.stub(esprimaParser, 'getNameFromPattern')
      .returns(patternName)
  })

  it('should call getNameFromPattern with pattern', () => {
    esprimaParser.getPatternExp(pattern)

    expect(
      esprimaParser.getNameFromPattern
        .calledWithExactly(pattern)
    ).to.be.true
  })

  it('should return an object containing caller of undefined and callee of result from getNameFromPattern', () => {
    const result = esprimaParser.getPatternExp(pattern)

    expect(result).to.be.eql({
      caller: undefined,
      callee: patternName
    })
  })
})
