// spec: https://github.com/estree/estree/blob/master/spec.md#whilestatement

describe('WhileStatement tests', () => {
  const label = 'label'
  const options = {label}
  const tests = [true, true, true]

  const setTestResults = (results) => {
    const getTestResults = createResultsGenerator(results)

    for (const index of results.keys()) {
      esprimaParser.parseNode
        .withArgs(whileStatement.test)
          .onCall(index).returns(getTestResults())
    }
  }
  let whileStatement

  beforeEach(() => {
    whileStatement = createAstNode('WhileStatement', {
      test: createAstNode('Expression'),
      body: createAstNode('Statement')
    })
    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'isLoopNeededToBreak')
    setTestResults(tests)
  })

  it('should call parseNode with test each loop', () => {
    // test will call more one time
    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.test).callCount
    ).to.be.equal(4)
  })

  it('should call parseNode with body each loop', () => {
    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).calledThrice
    ).to.be.true
  })

  it('should call isLoopNeededToBreak with options.label each loop given valid options', () => {
    esprimaParser.WhileStatement(whileStatement, options)

    expect(
      esprimaParser.isLoopNeededToBreak
        .withArgs(label).calledThrice
    ).to.be.true
  })

  it('should call isLoopNeededToBreak with undefined each loop given undefined options', () => {
    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.isLoopNeededToBreak
        .withArgs(undefined).calledThrice
    ).to.be.true
  })

  it('should break loop if isLoopNeededToBreak returns true', () => {
    esprimaParser.isLoopNeededToBreak
      .onCall(1).returns(true)

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).calledTwice
    ).to.be.true
  })

  it('should break loop if test fails', () => {
    setTestResults([true, true, false])

    esprimaParser.WhileStatement(whileStatement)

    expect(
      esprimaParser.parseNode
        .withArgs(whileStatement.body).calledTwice
    ).to.be.true
    expect(esprimaParser.isLoopNeededToBreak.calledTwice).to.be.true
  })

  const setParseNodeResults = () => {
    for (const index of tests.keys()) {
      esprimaParser.parseNode
        .withArgs(whileStatement.body)
          .onCall(index).returns(`resultFromParseNode${index + 1}`)
    }
  }
  
  it('should return result from last parseNode called with body given loop never breaks', () => {
    setParseNodeResults()

    const result = esprimaParser.WhileStatement(whileStatement)

    expect(result).to.be.equal('resultFromParseNode3')
  })

  it('should return result from second parseNode called with body given loop breaks at second loop', () => {
    setParseNodeResults()
    esprimaParser.isLoopNeededToBreak
      .onCall(1).returns(true)

    const result = esprimaParser.WhileStatement(whileStatement)

    expect(result).to.be.equal('resultFromParseNode2')
  })
})
