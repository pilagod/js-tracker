describe('parseMatchedSwitchCase tests', () => {
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
    sandbox.stub(esprimaParser, 'getFirstNonEmptyCaseIndex', sandbox.spy(() => {
      return 'firstNonEmptyCaseIndex'
    }))
    sandbox.stub(esprimaParser, 'parseSwitchCasesUntilBreakOrEnd', sandbox.spy(() => {
      return 'resultFromSwitchCases'
    }))
  })

  it('should call getFirstNonEmptyCaseIndex with switchCases and matchedIndex', () => {
    esprimaParser.parseMatchedSwitchCase(switchCases, matchedIndex)

    expect(
      esprimaParser.getFirstNonEmptyCaseIndex
        .calledWithExactly(switchCases, matchedIndex)
    ).to.be.true
  })

  it('should call parseSwitchCasesUntilBreakOrEnd with switchCases and firstNonEmptyCaseIndex then return', () => {
    const result = esprimaParser.parseMatchedSwitchCase(switchCases, matchedIndex)

    expect(
      esprimaParser.parseSwitchCasesUntilBreakOrEnd
        .calledWithExactly(switchCases, 'firstNonEmptyCaseIndex')
    ).to.be.true
    expect(result).to.be.equal('resultFromSwitchCases')
  })
})
