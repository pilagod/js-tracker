// spec: https://github.com/estree/estree/blob/master/spec.md#whilestatement

describe('WhileStatement tests', () => {
  const resultStub = 'resultFromParseLoopBody'
  const parseLoopBodyStub = {}
  const setTestResults = (results) => {
    const getTestResults = createResultsGenerator(results)

    for (const index of results.keys()) {
      esprimaParser.parseNode
        .withArgs(whileStatement.test)
          .onCall(index).returns(getTestResults())
    }
  }
  let whileStatement, FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    whileStatement = createAstNode('WhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })
    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'parseLoopBody')
      .returns(parseLoopBodyStub)
  })

  it('should call parseNode with test until test fails', () => {
    setTestResults([true, true, false, true, true])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.test).calledThrice
    ).to.be.true
  })

  it('should call parseLoopBody with body each loop', () => {
    setTestResults([true, true, false])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseLoopBody
        .withArgs(whileStatement.body).calledTwice
    ).to.be.true
  })

  it('should break loop given parseLoopBody return state FlowState.BREAK and return result from parseLoopBody', () => {
    setTestResults([true, true, true])
    esprimaParser.parseLoopBody
      .onCall(1).returns({
        result: resultStub,
        state: FlowState.BREAK
      })
    const result = esprimaParser.WhileStatement(whileStatement)

    expect(esprimaParser.parseLoopBody.calledTwice).to.be.true
    expect(result).to.be.equal(resultStub)
  })

  it('should return last result from parseLoopBody given no FlowState.BREAK signal', () => {
    setTestResults([true, true, true])
    esprimaParser.parseLoopBody
      .onCall(2).returns({
        result: resultStub,
        state: FlowState.BREAK
      })
    const result = esprimaParser.WhileStatement(whileStatement)

    expect(result).to.be.equal(resultStub)
  })

  it('should return undefined given test fails from beginning', () => {
    setTestResults([false])

    const result = esprimaParser.WhileStatement(whileStatement)

    expect(esprimaParser.parseLoopBody.called).to.be.false
    expect(result).to.be.undefined
  })
})
