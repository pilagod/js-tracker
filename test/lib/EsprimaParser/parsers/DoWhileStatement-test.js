// spec: https://github.com/estree/estree/blob/master/spec.md#dowhilestatement

describe('DoWhileStatement tests', () => {
  let doWhileStatement

  beforeEach(() => {
    doWhileStatement = createAstNode('DoWhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'resetLoopStatus')
    sandbox.stub(esprimaParser, 'WhileStatement')
  })

  it('should call parseNode with body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(doWhileStatement.body)
    ).to.be.true
  })

  it('should call resetLoopStatus after parsing body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.resetLoopStatus
        .calledAfter(
          esprimaParser.parseNode
            .withArgs(doWhileStatement.body)
        )
    ).to.be.true
  })

  it('should not call WhileStatement given resetLoopStatus returns \'break\' status', () => {
    esprimaParser.resetLoopStatus.returns('break')

    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.WhileStatement.called).to.be.false
  })

  it('should return result from parseNode with body given resetLoopStatus returns \'break\' status', () => {
    esprimaParser.resetLoopStatus.returns('break')
    esprimaParser.parseNode.returns('resultFromParseNode')

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromParseNode')
  })

  it('should return result from WhileStatement given resetLoopStatus returns not \'break\' status', () => {
    esprimaParser.resetLoopStatus.returns(undefined)
    esprimaParser.WhileStatement.returns('resultFromWhileStatement')

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromWhileStatement')
  })
})
