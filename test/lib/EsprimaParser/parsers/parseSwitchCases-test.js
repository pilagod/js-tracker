describe('parseSwitchCases tests', () => {
  let switchCases

  beforeEach(() => {
    switchCases = (() => {
      const result = []
      for (let i = 0; i < 3; i += 1) {
        result.push(createAstNode(`SwitchCase${i+1}`, {test: `SwitchCase${i+1}Test`}))
      }
      return result
    })()

    sandbox.stub(esprimaParser, 'parseMatchedSwitchCase', sandbox.spy(() => {
      return 'resultFromParseMatchedSwitchCase'
    }))
  })

  it('should call isCaseTestMatchDiscriminant with each test of SwitchCase and discriminant until default case given no matched cases', () => {
    sandbox.stub(esprimaParser, 'isCaseTestMatchDiscriminant', sandbox.spy(
      // last one result always true, standing for default case
      createResultsGenerator([false, false, true])
    ))

    esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    switchCases.forEach((switchCase, index) => {
      expect(
        esprimaParser.isCaseTestMatchDiscriminant
          .getCall(index)
          .calledWithExactly(switchCase.test, 'discriminant')
      )
    })
  })

  it('should call isCaseTestMatchDiscriminant with each test of SwitchCase and discriminant until first matched case', () => {
    sandbox.stub(esprimaParser, 'isCaseTestMatchDiscriminant', sandbox.spy(
      createResultsGenerator([false, true, true])
    ))

    esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    expect(esprimaParser.isCaseTestMatchDiscriminant.calledTwice).to.be.true
    expect(
      esprimaParser.isCaseTestMatchDiscriminant
        .neverCalledWith('SwitchCase3Test')
    )
  })

  it('should call parseMatchedSwitchCase with SwitchCases and matched index then return when test matched discriminant', () => {
    sandbox.stub(esprimaParser, 'isCaseTestMatchDiscriminant', sandbox.spy(
      createResultsGenerator([false, true, true])
    ))

    const result = esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    expect(
      esprimaParser.parseMatchedSwitchCase
        .calledWithExactly(switchCases, 1)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseMatchedSwitchCase')
  })
})
