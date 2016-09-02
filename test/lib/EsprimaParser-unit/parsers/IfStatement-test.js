// spec: https://github.com/estree/estree/blob/master/spec.md#ifstatement

describe('IfStatement tests', () => {
  let ifStatement

  beforeEach(() => {
    ifStatement = createAstNode('IfStatement', {
      test: createAstNode('Expression'),
      consequent: createAstNode('StatementConsequent'),
      alternate: createAstNode('StatementAlternate')
    })

    const parseNodeStub = createParseNodeStub()

    sandbox.stub(esprimaParser, 'parseNode')
      .withArgs(ifStatement.consequent)
        .returns(parseNodeStub(ifStatement.consequent))
      .withArgs(ifStatement.alternate)
        .returns(parseNodeStub(ifStatement.alternate))
  })

  it('should call parseNode with test', () => {
    esprimaParser.parseNode
      .withArgs(ifStatement.test).returns(true)

    esprimaParser.IfStatement(ifStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(ifStatement.test)
    ).to.be.true
  })

  it('should call parseNode with consequent only and return given test passes', () => {
    esprimaParser.parseNode
      .withArgs(ifStatement.test).returns(true)

    const result = esprimaParser.IfStatement(ifStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(ifStatement.consequent)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(ifStatement.alternate)
    ).to.be.true
    expect(result).to.be.equal('parsedStatementConsequent')
  })

  it('should call parseNode with alternate only and return given test falis', () => {
    esprimaParser.parseNode
      .withArgs(ifStatement.test).returns(false)

    const result = esprimaParser.IfStatement(ifStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(ifStatement.alternate)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(ifStatement.consequent)
    ).to.be.true
    expect(result).to.be.equal('parsedStatementAlternate')
  })
})
