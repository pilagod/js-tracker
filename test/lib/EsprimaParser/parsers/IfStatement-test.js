// spec: https://github.com/estree/estree/blob/master/spec.md#ifstatement

describe('IfStatement tests', () => {
  let ifStatement

  beforeEach(() => {
    ifStatement = createAstNode('IfStatement', {
      test: createAstNode('Literal', {value: true}),
      consequent: createAstNode('Literal', {value: 'consequent'}),
      alternate: createAstNode('Literal', {value: 'alternate'})
    })

    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy(createLiteralStub()))
  })

  it('should call parseNode with test', () => {
    ifStatement.test = createAstNode('Literal', {value: true})

    esprimaParser.IfStatement(ifStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(ifStatement.test)
    ).to.be.true
  })

  it('should call parseNode with consequent only and return given test passes', () => {
    const result = esprimaParser.IfStatement(ifStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(ifStatement.consequent)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(ifStatement.alternate)
    ).to.be.true
    expect(result).to.be.equal('consequent')
  })

  it('should call parseNode with alternate only and return given test falis', () => {
    ifStatement.test = createAstNode('Literal', {value: false})

    const result = esprimaParser.IfStatement(ifStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(ifStatement.alternate)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(ifStatement.consequent)
    ).to.be.true
    expect(result).to.be.equal('alternate')
  })
})
