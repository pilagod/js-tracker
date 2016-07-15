describe('isCaseNotEmptyOrDefault tests', () => {
  let switchCase

  beforeEach(() => {
    switchCase = createAstNode('SwitchCase')
  })

  it('should return true given non empty switchCase.consequent', () => {
    switchCase.consequent = [createAstNode()]

    const result = esprimaParser.isCaseNotEmptyOrDefault(switchCase)

    expect(result).to.be.true
  })

  it('should return true given null switchCase.test', () => {
    switchCase.test = null

    const result = esprimaParser.isCaseNotEmptyOrDefault(switchCase)

    expect(result).to.be.true
  })

  it('should return false given empty switchCase.consequent', () => {
    switchCase.consequent = []

    const result = esprimaParser.isCaseNotEmptyOrDefault(switchCase)

    expect(result).to.be.false
  })
})
