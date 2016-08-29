// spec: https://github.com/estree/estree/blob/master/spec.md#dowhilestatement

describe('DoWhileStatement tests', () => {
  const resultStub = 'resultFromParseLoopBody'
  const parseLoopBodyStub = {}

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
      .returns(parseLoopBodyStub)
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

  it('should not call WhileStatement given parseLoopBody return state FlowState.BREAK and return result from parseLoopBody', () => {
    esprimaParser.parseLoopBody
      .returns({
        result: resultStub,
        state: FlowState.BREAK
      })
    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(esprimaParser.WhileStatement.called).to.be.false
    expect(result).to.be.equal(resultStub)
  })

  it('should return result from WhileStatement given state from parseLoopBody is not FlowState.BREAK', () => {
    const result = esprimaParser.DoWhileStatement(doWhileStatement)

    expect(result).to.be.equal('resultFromWhileStatement')
  })
})
