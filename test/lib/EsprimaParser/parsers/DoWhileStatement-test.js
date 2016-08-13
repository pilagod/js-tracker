// spec: https://github.com/estree/estree/blob/master/spec.md#dowhilestatement

describe('DoWhileStatement tests', () => {
  let doWhileStatement, FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    doWhileStatement = createAstNode('DoWhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'resetLoopState')
    sandbox.stub(esprimaParser, 'WhileStatement')
  })

  it('should call parseNode with body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(doWhileStatement.body)
    ).to.be.true
  })

  it('should call resetLoopState after parsing body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.resetLoopState
        .calledAfter(
          esprimaParser.parseNode
            .withArgs(doWhileStatement.body)
        )
    ).to.be.true
  })

  it('should not call WhileStatement given resetLoopState returns FlowState.BREAK', () => {
    esprimaParser.resetLoopState.returns(FlowState.BREAK)

    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.WhileStatement.called).to.be.false
  })

  it('should return result from parseNode with body given resetLoopState returns FlowState.BREAK', () => {
    esprimaParser.resetLoopState.returns(FlowState.BREAK)
    esprimaParser.parseNode.returns('resultFromParseNode')

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromParseNode')
  })

  it('should return result from WhileStatement given resetLoopState returns not \'break\' status', () => {
    esprimaParser.resetLoopState.returns(undefined)
    esprimaParser.WhileStatement.returns('resultFromWhileStatement')

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromWhileStatement')
  })
})
