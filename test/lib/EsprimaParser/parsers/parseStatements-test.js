describe('parseStatements tests', () => {
  let body

  const setStateStub = (results) => {
    sandbox.stub(esprimaParser, 'flowState', {
      isEitherState: sandbox.spy(
        createResultsGenerator(results)
      )
    })
  }

  beforeEach(() => {
    body = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3')
    ]

    sandbox.stub(esprimaParser, 'parseNode', createParseNodeStub())
  })

  it('should call isEitherState of flowState each loop given no flow control statement', () => {
    setStateStub([false, false, false])

    esprimaParser.parseStatements(body)

    expect(esprimaParser.flowState.isEitherState.calledThrice).to.be.true
  })

  it('should call parseNode with each body node given no flow control statement, and return last parsed result', () => {
    setStateStub([false, false, false])

    const result = esprimaParser.parseStatements(body)

    body.forEach((node, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(node)
      ).to.be.true
    })
    expect(result).to.be.equal('parsedStatement3')
  })

  it('should call isEitherState of flowState until first flow control statement', () => {
    setStateStub([false, true, false])

    esprimaParser.parseStatements(body)

    expect(esprimaParser.flowState.isEitherState.calledTwice).to.be.true
  })

  it('should call parseNode with node until first flow control statement and return the result', () => {
    setStateStub([false, true, false])

    const result = esprimaParser.parseStatements(body)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(body[2])
    ).to.be.true
    expect(result).to.be.equal('parsedStatement2')
  })
})
