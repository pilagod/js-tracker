describe('parseSwitchCases tests', () => {
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
    sandbox.stub(esprimaParser, 'parseMatchedSwitchCase', sandbox.spy(() => {
      return 'resultFromParseMatchedSwitchCase'
    }))
  })

  it('should call isCaseTestMatchDiscriminant with SwitchCase test and discriminant until default case given no matched cases', () => {
    sandbox.stub(esprimaParser, 'isCaseTestMatchDiscriminant', sandbox.spy(
      // last one result always true, standing for default case
      createResultsGenerator([false, false, false, false, true])
    ))

    esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    switchCases.forEach((switchCase, index) => {
      expect(
        esprimaParser.isCaseTestMatchDiscriminant
          .getCall(index)
          .calledWithExactly(switchCase.test, 'discriminant')
      ).to.be.true
    })
  })

  it('should call isCaseTestMatchDiscriminant with each SwitchCase test and discriminant until first matched case', () => {
    sandbox.stub(esprimaParser, 'isCaseTestMatchDiscriminant', sandbox.spy(
      createResultsGenerator([false, true, false, false, true])
    ))

    esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    expect(esprimaParser.isCaseTestMatchDiscriminant.calledTwice).to.be.true
    for (let i = 2; i < 5; i += 1) {
      expect(
        esprimaParser.isCaseTestMatchDiscriminant
          .neverCalledWith(`SwitchCase${i+1}Test`)
      ).to.be.true
    }
  })

  it('should call parseMatchedSwitchCase with SwitchCases and matchedIndex then return when case matched', () => {
    sandbox.stub(esprimaParser, 'isCaseTestMatchDiscriminant',
      createResultsGenerator([false, true, false, false, true])
    )

    const result = esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    expect(
      esprimaParser.parseMatchedSwitchCase
        .calledWithExactly(switchCases, 1)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseMatchedSwitchCase')
  })
})
