// spec: https://github.com/estree/estree/blob/master/spec.md#dowhilestatement

describe('DoWhileStatement tests', () => {
  let doWhileStatement

  beforeEach(() => {
    doWhileStatement = createAstNode('DoWhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'status', {
      unset: sandbox.spy(),
      isLoopBreakStatus: sandbox.stub(),
      isLoopContinueStatus: sandbox.stub()
    })
    sandbox.stub(esprimaParser, 'WhileStatement')
  })

  it('should call parseNode with body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(doWhileStatement.body)
    ).to.be.true
  })

  it('should call isLoopBreakStatus of esprimaParser status', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.status.isLoopBreakStatus.calledOnce).to.be.true
  })

  it('should call isLoopContinueStatus of esprimaParser status', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.status.isLoopContinueStatus.calledOnce).to.be.true
  })

  it('should call parseNode before isLoopBreakStatus and isLoopContinueStatus', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.parseNode
        .calledBefore(esprimaParser.status.isLoopBreakStatus)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledBefore(esprimaParser.status.isLoopContinueStatus)
    ).to.be.true
  })

  it('should unset continue status given isLoopContinueStatus returns true', () => {
    esprimaParser.status.isLoopContinueStatus.returns(true)

    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.status.unset
        .calledWithExactly('continue')
    ).to.be.true
  })

  it('should not call WhileStatement and should unset break status given isLoopBreakStatus returns true', () => {
    esprimaParser.status.isLoopBreakStatus.returns(true)

    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.WhileStatement.called).to.be.false
    expect(
      esprimaParser.status.unset
        .calledWithExactly('break')
    ).to.be.true
  })

  it('should call WhileStatement with doWhileStatement given isLoopBreakStatus returns false', () => {
    esprimaParser.status.isLoopBreakStatus.returns(false)

    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.WhileStatement
        .calledWithExactly(doWhileStatement)
    ).to.be.true
  })

  it('should return result from parseNode given isLoopBreakStatus returns true', () => {
    esprimaParser.parseNode.returns('parsedStatement')
    esprimaParser.status.isLoopBreakStatus.returns(true)

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('parsedStatement')
  })

  it('should return result from WhileStatement given isLoopBreakStatus returns false', () => {
    esprimaParser.status.isLoopBreakStatus.returns(false)
    esprimaParser.WhileStatement.returns('resultFromWhileStatement')

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromWhileStatement')
  })
})
