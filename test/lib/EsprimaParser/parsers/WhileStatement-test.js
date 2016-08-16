// spec: https://github.com/estree/estree/blob/master/spec.md#whilestatement

describe('WhileStatement tests', () => {
  const resultStub = 'resultFromParseLoopBody'
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
      .returns([resultStub])
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

  it('should break loop given parseLoopBody return state FlowState.BREAK', () => {
    setTestResults([true, true, true])

    esprimaParser.parseLoopBody
      .onCall(1).returns([resultStub, FlowState.BREAK])

    esprimaParser.WhileStatement(whileStatement)

    expect(esprimaParser.parseLoopBody.calledTwice).to.be.true
  })

  it('should return parsed body result', () => {
    setTestResults([true])

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
