describe('parseSwitchCases tests', () => {
  let switchCases

  const setIsCaseMatchedStub = (results) => {
    sandbox.stub(esprimaParser, 'isCaseMatched', createResultsGenerator(results))
  }

  before(() => {
    switchCases = (() => {
      const result = []
      for (let i = 0; i < 5; i += 1) {
        result.push(
          createAstNode(`SwitchCase${i+1}`, {
            test: createAstNode(`ExpressionTest${i+1}`)
          })
        )
      }
      return result
    })()
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseMatchedCase')
      .returns('resultFromParseMatchedSwitchCase')
  })

  it('should call isCaseMatched with SwitchCase test and discriminant until default case given no matched cases', () => {
    // last one result always true, standing for default case
    setIsCaseMatchedStub([false, false, false, false, true])

    esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    switchCases.forEach((switchCase, index) => {
      expect(
        esprimaParser.isCaseMatched
          .getCall(index)
          .calledWithExactly(switchCase.test, 'discriminant')
      ).to.be.true
    })
  })

  it('should call isCaseMatched with each SwitchCase test and discriminant until first matched case', () => {
    setIsCaseMatchedStub([false, true, false, false, true])

    esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    expect(esprimaParser.isCaseMatched.calledTwice).to.be.true
    for (let i = 2; i < 5; i += 1) {
      expect(
        esprimaParser.isCaseMatched
          .neverCalledWith(switchCases[i].test)
      ).to.be.true
    }
  })

  it('should call parseMatchedSwitchCase with SwitchCases and matchedIndex then return when case matched', () => {
    setIsCaseMatchedStub([false, true, false, false, true])

    const result =
      esprimaParser.parseSwitchCases(switchCases, 'discriminant')

    expect(
      esprimaParser.parseMatchedCase
        .calledWithExactly(switchCases, 1)
    ).to.be.true
    expect(result).to.be.equal('resultFromParseMatchedSwitchCase')
  })
})
