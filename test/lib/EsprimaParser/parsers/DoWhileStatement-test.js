// spec: https://github.com/estree/estree/blob/master/spec.md#dowhilestatement

describe('DoWhileStatement tests', () => {
  const resultStub = 'resultFromParseLoopBody'

  let doWhileStatement, FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    doWhileStatement = createAstNode('DoWhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })

    sandbox.stub(esprimaParser, 'parseLoopBody')
      .returns([resultStub])
    sandbox.stub(esprimaParser, 'WhileStatement')
      .returns('resultFromWhileStatement')
  })

  it('should call parseLoopBody with body', () => {
    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(
      esprimaParser.parseLoopBody
        .withArgs(doWhileStatement.body).calledOnce
    ).to.be.true
  })

  it('should not call WhileStatement given parseLoopBody return state FlowState.BREAK', () => {
    esprimaParser.parseLoopBody
      .returns([resultStub, FlowState.BREAK])

    esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.WhileStatement.called).to.be.false
  })

  it('should return result from parseLoopBody given parseLoopBody return state FlowState.BREAK', () => {
    esprimaParser.parseLoopBody
      .returns([resultStub, FlowState.BREAK])

    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal(resultStub)
  })

  it('should return result from WhileStatement given parseLoopBody return state not FlowState.BREAK', () => {
    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromWhileStatement')
  })
})
