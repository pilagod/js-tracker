// spec: https://github.com/estree/estree/blob/master/spec.md#whilestatement

describe('WhileStatement tests', () => {
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
    sandbox.stub(esprimaParser, 'resetLoopState')
  })

  it('should call parseNode with test until test fails', () => {
    setTestResults([true, true, false, true, true])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.test).calledThrice
    ).to.be.true
  })

  it('should call parseNode with body each time test passes', () => {
    setTestResults([true, true, false])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).calledTwice
    ).to.be.true
  })

  it('should call resetLoopState after parsing body each loop', () => {
    setTestResults([true, true, false])

    esprimaParser.WhileStatement(whileStatement)

    for (let i = 0; i < 2; i += 1) {
      expect(
        esprimaParser.resetLoopState
          .getCall(i)
          .calledAfter(
            esprimaParser.parseNode
              .withArgs(whileStatement.body)
              .getCall(i)
          )
      ).to.be.true
    }
    expect(esprimaParser.resetLoopState.calledTwice).to.be.true
  })

  it('should break loop given resetLoopState returns FlowState.BREAK', () => {
    setTestResults([true, true, true])
    esprimaParser.resetLoopState
      .onCall(1).returns(FlowState.BREAK)

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).calledTwice
    ).to.be.true
  })

  it('should return parsed body result', () => {
    setTestResults([true])
    esprimaParser.parseNode
      .withArgs(whileStatement.body)
        .returns('parsedStatement')

    const result = esprimaParser.WhileStatement(whileStatement)

    expect(result).to.be.equal('parsedStatement')
  })

  it('should return undefined given test fails from beginning', () => {
    setTestResults([false])

    const result = esprimaParser.WhileStatement(whileStatement)

    expect(result).to.be.undefined
    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).called
    ).to.be.false
  })
})
