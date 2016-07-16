describe('parseBlockStatementBody tests', () => {
  const setStatusStub = (
    results = [false, false, false]
  ) => {
    if (esprimaParser.status.restore) {
      esprimaParser.status.restore()
    }
    sandbox.stub(esprimaParser, 'status', {
      isEitherStatus: sandbox.spy(
        createResultsGenerator(results)
      )
    })
  }
  let body

  beforeEach(() => {
    // given three body nodes
    body = [
      createAstNode('Statement1'),
      createAstNode('Statement2'),
      createAstNode('Statement3')
    ]

    setStatusStub()
    sandbox.stub(esprimaParser, 'parseNode', sandbox.spy((node) => {
      return `resultFrom${node.type}`
    }))
  })

  it('should call isEitherStatus of esprimaParser status each loop given no flow control statement', () => {
    esprimaParser.parseStatementBody(body)

    expect(esprimaParser.status.isEitherStatus.calledThrice).to.be.true
  })

  it('should call parseNode with each body node given no flow control statement, and return last parsed result', () => {
    const result = esprimaParser.parseStatementBody(body)

    body.forEach((node, index) => {
      expect(
        esprimaParser.parseNode
          .getCall(index)
          .calledWithExactly(node)
      ).to.be.true
    })
    expect(result).to.be.equal('resultFromStatement3')
  })

  it('should call isEitherStatus of esprimaParser status until first flow control statement', () => {
    setStatusStub([false, true, false])

    esprimaParser.parseStatementBody(body)

    expect(esprimaParser.status.isEitherStatus.calledTwice).to.be.true
  })

  it('should call parseNode with node until first flow control statement and return the result', () => {
    setStatusStub([false, true, false])

    const result = esprimaParser.parseStatementBody(body)

    expect(esprimaParser.parseNode.calledTwice).to.be.true
    expect(
      esprimaParser.parseNode
        .neverCalledWith(body[2])
    ).to.be.true
    expect(result).to.be.equal('resultFromStatement2')
  })
})
