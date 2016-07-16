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
    sandbox.stub(esprimaParser, 'parseMatchedCase', sandbox.spy(() => {
      return 'resultFromParseMatchedSwitchCase'
    }))
  })

  it('should call isTestMatchDiscriminant with SwitchCase test and discriminant until default case given no matched cases', () => {
    sandbox.stub(esprimaParser, 'isTestMatchDiscriminant', sandbox.spy(
      // last one result always true, standing for default case
      createResultsGenerator([false, false, false, false, true])
    ))

    esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    switchCases.forEach((switchCase, index) => {
      expect(
        esprimaParser.isTestMatchDiscriminant
          .getCall(index)
          .calledWithExactly(switchCase.test, 'discriminant')
      ).to.be.true
    })
  })

  it('should call isTestMatchDiscriminant with each SwitchCase test and discriminant until first matched case', () => {
    sandbox.stub(esprimaParser, 'isTestMatchDiscriminant', sandbox.spy(
      createResultsGenerator([false, true, false, false, true])
    ))

    esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    expect(esprimaParser.isTestMatchDiscriminant.calledTwice).to.be.true
    for (let i = 2; i < 5; i += 1) {
      expect(
        esprimaParser.isTestMatchDiscriminant
          .neverCalledWith(`SwitchCase${i+1}Test`)
      ).to.be.true
    }
  })

  it('should call parseMatchedSwitchCase with SwitchCases and matchedIndex then return when case matched', () => {
    sandbox.stub(esprimaParser, 'isTestMatchDiscriminant',
      createResultsGenerator([false, true, false, false, true])
    )

    const result = esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    expect(
      esprimaParser.parseMatchedCase
        .calledWithExactly(switchCases, 1)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseMatchedSwitchCase')
  })
})
