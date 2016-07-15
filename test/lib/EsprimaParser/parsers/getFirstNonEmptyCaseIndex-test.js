describe('getFirstNonEmptyCaseIndex tests', () => {
  const matchedIndex = 1
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

  it('should call isCaseNotEmptyOrDefault with each switchCase from matchedIndex given no matched cases', () => {
    sandbox.stub(esprimaParser, 'isCaseNotEmptyOrDefault', sandbox.spy(
      // index start from 1, remove first 'false':
      // [false, false, false, false, true] -> [false, false, false, true]
      createResultsGenerator([false, false, false, true])
    ))

    esprimaParser.getFirstNonEmptyCaseIndex(switchCases, matchedIndex)

    expect(esprimaParser.isCaseNotEmptyOrDefault.callCount).to.be.equal(4)
    expect(
      esprimaParser.isCaseNotEmptyOrDefault
        .neverCalledWith(switchCases[0])
    ).to.be.true
  })

  it('should return default case index given no matched cases', () => {
    sandbox.stub(esprimaParser, 'isCaseNotEmptyOrDefault',
      createResultsGenerator([false, false, false, true])
    )

    const result = esprimaParser.getFirstNonEmptyCaseIndex(switchCases, matchedIndex)

    expect(result).to.be.equal(4)
  })

  it('should return firstNonEmptyCaseIndex 3 given third case the first non empty one', () => {
    sandbox.stub(esprimaParser, 'isCaseNotEmptyOrDefault',
      createResultsGenerator([false, false, true, true])
    )

    const result = esprimaParser.getFirstNonEmptyCaseIndex(switchCases, matchedIndex)

    expect(result).to.be.equal(3)
  })
})
