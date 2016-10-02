// spec: https://github.com/estree/estree/blob/master/spec.md#dowhilestatement

describe('DoWhileStatement tests', () => {
  const label = 'label'
  const options = {label}
  let doWhileStatement

  beforeEach(() => {
    doWhileStatement = createAstNode('DoWhileStatement', {
      body: createAstNode('Statement')
    })
    sandbox.stub(esprimaParser, 'isLoopNeededToBreak')
    sandbox.stub(esprimaParser, 'parseNode').returns('resultFromParseNode')
    sandbox.stub(esprimaParser, 'WhileStatement').returns('resultFromWhileStatement')
  })

  it('should call parseNode with body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(doWhileStatement.body)
    ).to.be.true
  })

  it('should call isLoopNeededToBreak with options.label given valid options', () => {
    esprimaParser.DoWhileStatement(doWhileStatement, options)

    expect(
      esprimaParser.isLoopNeededToBreak
        .calledWithExactly(label)
    ).to.be.true
  })

  it('should call isLoopNeededToBreak with undefined given undefined options', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.isLoopNeededToBreak
        .calledWithExactly(undefined)
    ).to.be.true
  })

  it('should return result from WhileStatement called with doWhileStatement if isLoopNeededToBreak returns false', () => {
    esprimaParser.isLoopNeededToBreak.returns(false)

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.WhileStatement
        .calledWithExactly(doWhileStatement)
    ).to.be.true
    expect(result).to.be.equal('resultFromWhileStatement')
  })

  it('should return result from parseNode called with doWhileStatement if isLoopNeededToBreak returns true', () => {
    esprimaParser.isLoopNeededToBreak.returns(true)

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.WhileStatement.called).to.be.false
    expect(result).to.be.equal('resultFromParseNode')
  })
})
