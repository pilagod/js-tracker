describe('parseNonHoistingStatements tests', () => {
  const setStateStub = (results) => {
    sandbox.stub(esprimaParser, 'flowState', {
      isEitherState: sandbox.spy(
        createResultsGenerator(results)
      )
    })
  }
  let statements

  before(() => {
    statements = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3')
    ]
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should call isEitherState of flowState each loop given no flow control statement', () => {
    setStateStub([false, false, false])

    esprimaParser.parseNonHoistingStatements(statements)

    expect(esprimaParser.flowState.isEitherState.calledThrice).to.be.true
  })

  it('should call parseNode with each body node given no flow control statement, and return last parsed result', () => {
    setStateStub([false, false, false])

    const result = esprimaParser.parseNonHoistingStatements(statements)

    statements.forEach((statement, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
            .calledWithExactly(statement)
      ).to.be.true
    })
    expect(result).to.be.equal('parsedStatement3')
  })

  it('should call isEitherState of flowState until getting first flow control state', () => {
    setStateStub([false, true, false])

    esprimaParser.parseNonHoistingStatements(statements)

    expect(esprimaParser.flowState.isEitherState.calledTwice).to.be.true
  })

  it('should call parseNode with node until getting first flow control state and return the result', () => {
    setStateStub([false, true, false])

    const result = esprimaParser.parseNonHoistingStatements(statements)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(statements[2])
    ).to.be.true
    expect(result).to.be.equal('parsedStatement2')
  })
})
