describe('parseStatements tests', () => {
  let body

  const setStatusStub = (results) => {
    sandbox.stub(esprimaParser, 'flowStatus', {
      isEitherStatus: sandbox.spy(
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

  it('should call isEitherStatus of flowStatus each loop given no flow control statement', () => {
    setStatusStub([false, false, false])

    esprimaParser.parseStatements(body)

    expect(esprimaParser.flowStatus.isEitherStatus.calledThrice).to.be.true
  })

  it('should call parseNode with each body node given no flow control statement, and return last parsed result', () => {
    setStatusStub([false, false, false])

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

  it('should call isEitherStatus of flowStatus until first flow control statement', () => {
    setStatusStub([false, true, false])

    esprimaParser.parseStatements(body)

    expect(esprimaParser.flowStatus.isEitherStatus.calledTwice).to.be.true
  })

  it('should call parseNode with node until first flow control statement and return the result', () => {
    setStatusStub([false, true, false])

    const result = esprimaParser.parseStatements(body)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(body[2])
    ).to.be.true
    expect(result).to.be.equal('parsedStatement2')
  })
})
