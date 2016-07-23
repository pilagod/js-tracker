// spec: https://github.com/estree/estree/blob/master/spec.md#dowhilestatement

describe('DoWhileStatement tests', () => {
  let doWhileStatement

  beforeEach(() => {
    doWhileStatement = createAstNode('DoWhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'getLoopStatusAndReset')
    sandbox.stub(esprimaParser, 'WhileStatement')
  })

  it('should call parseNode with body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(doWhileStatement.body)
    ).to.be.true
  })

  it('should call getLoopStatusAndReset after parsing body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.getLoopStatusAndReset
        .calledAfter(
          esprimaParser.parseNode
            .withArgs(doWhileStatement.body)
        )
    ).to.be.true
  })

  it('should not call WhileStatement given getLoopStatusAndReset returns \'break\' status', () => {
    esprimaParser.getLoopStatusAndReset.returns('break')

    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.WhileStatement.called).to.be.false
  })

  it('should return result from parseNode with body given getLoopStatusAndReset returns \'break\' status', () => {
    esprimaParser.getLoopStatusAndReset.returns('break')
    esprimaParser.parseNode.returns('resultFromParseNode')

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromParseNode')
  })

  it('should return result from WhileStatement given getLoopStatusAndReset returns not \'break\' status', () => {
    esprimaParser.getLoopStatusAndReset.returns(undefined)
    esprimaParser.WhileStatement.returns('resultFromWhileStatement')

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromWhileStatement')
  })
})
