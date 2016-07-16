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
    sandbox.stub(esprimaParser, 'getFirstNonEmptyCaseIndex', sandbox.spy(() => {
      return 'firstNonEmptyCaseIndex'
    }))
    sandbox.stub(esprimaParser, 'parseCasesUntilBreakOrDefault', sandbox.spy(() => {
      return 'resultFromSwitchCases'
    }))
  })

  it('should call getFirstNonEmptyCaseIndex with switchCases and matchedIndex', () => {
    esprimaParser.parseMatchedCase(switchCases, matchedIndex)

    expect(
      esprimaParser.getFirstNonEmptyCaseIndex
        .calledWithExactly(switchCases, matchedIndex)
    ).to.be.true
  })

  it('should call parseCasesUntilBreakOrDefault with switchCases and firstNonEmptyCaseIndex then return', () => {
    const result = esprimaParser.parseMatchedCase(switchCases, matchedIndex)

    expect(
      esprimaParser.parseCasesUntilBreakOrDefault
        .calledWithExactly(switchCases, 'firstNonEmptyCaseIndex')
    ).to.be.true
    expect(result).to.be.equal('resultFromSwitchCases')
  })
})
