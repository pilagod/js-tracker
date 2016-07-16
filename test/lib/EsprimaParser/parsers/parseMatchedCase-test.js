describe('parseMatchedCase tests', () => {
  const matchedIndex = 1
  const firstNonEmptyCaseIndex = 2
  let switchCases

  before(() => {
    switchCases = (() => {
      const result = []
      for (let i = 0; i < 5; i += 1) {
        result.push(createAstNode(`SwitchCase${i+1}`, {test: `SwitchCase${i+1}Test`}))
      }
      return result
    })()
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getFirstNonEmptyCaseIndex', sandbox.spy(() => {
      return firstNonEmptyCaseIndex
    }))
    sandbox.stub(esprimaParser, 'parseStatements', sandbox.spy(() => {
      return 'resultFromParseStatements'
    }))
  })

  it('should call getFirstNonEmptyCaseIndex with switchCases and matchedIndex', () => {
    esprimaParser.parseMatchedCase(switchCases, matchedIndex)

    expect(
      esprimaParser.getFirstNonEmptyCaseIndex
        .calledWithExactly(switchCases, matchedIndex)
    ).to.be.true
  })

  it('should call parseStatementBody with switchCases slice by firstNonEmptyCaseIndex and return ', () => {
    const result = esprimaParser.parseMatchedCase(switchCases, matchedIndex)

    expect(
      esprimaParser.parseStatements
        .calledWithExactly(switchCases.slice(firstNonEmptyCaseIndex))
    ).to.be.true
    expect(result).to.be.equal('resultFromParseStatements')
  })
})
