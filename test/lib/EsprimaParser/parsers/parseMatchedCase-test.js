describe('parseMatchedCase tests', () => {
  const matchedIndex = 1
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
    sandbox.stub(esprimaParser, 'parseStatements', sandbox.spy(() => {
      return 'resultFromParseStatements'
    }))
  })

  it('should call parseStatementBody with switchCases slice by matchedIndex and return ', () => {
    const result = esprimaParser.parseMatchedCase(switchCases, matchedIndex)

    expect(
      esprimaParser.parseStatements
        .calledWithExactly(switchCases.slice(matchedIndex))
    ).to.be.true
    expect(result).to.be.equal('resultFromParseStatements')
  })
})
