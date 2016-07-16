describe('getFirstNonEmptyCaseIndex tests', () => {
  const matchedIndex = 1
  const setIsCaseNonEmptyOrDefaultStub = (results) => {
    sandbox.stub(esprimaParser, 'isCaseNonEmptyOrDefault', sandbox.spy(
      createResultsGenerator(results)
    ))
  }
  let switchCases

  before(() => {
    // first three cases are empty case
    switchCases = (() => {
      const result = []
      for (let i = 0; i < 5; i += 1) {
        result.push(createAstNode(`SwitchCase${i+1}`, {test: `SwitchCase${i+1}Test`}))
      }
      return result
    })()
  })

  it('should call isCaseNonEmptyOrDefault with each switchCase from matchedIndex given no matched cases', () => {
    // index would start from 1 given matchedIndex 1
    // first result of isCaseNonEmptyOrDefault is omitted
    setIsCaseNonEmptyOrDefaultStub([/*false, */false, false, false, true])

    esprimaParser.getFirstNonEmptyCaseIndex(switchCases, matchedIndex)

    expect(esprimaParser.isCaseNonEmptyOrDefault.callCount).to.be.equal(4)
    expect(
      esprimaParser.isCaseNonEmptyOrDefault
        .neverCalledWith(switchCases[0])
    ).to.be.true
  })

  it('should return default case index given no matched cases', () => {
    setIsCaseNonEmptyOrDefaultStub([/*false, */false, false, false, true])

    const result = esprimaParser.getFirstNonEmptyCaseIndex(switchCases, matchedIndex)

    expect(result).to.be.equal(4)
  })

  it('should return firstNonEmptyCaseIndex 3 given third case the first non empty one', () => {
    setIsCaseNonEmptyOrDefaultStub([/*false, */false, false, true, true])

    const result = esprimaParser.getFirstNonEmptyCaseIndex(switchCases, matchedIndex)

    expect(result).to.be.equal(3)
  })
})
