describe('parseParams tests', () => {
  const params = ['param1', 'param2', 'param3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getNameFromPattern')
  })

  it('should call getNameFromPattern with each given param', () => {
    esprimaParser.parseParams(params)

    for (const [index, param] of params.entries()) {
      expect(
        esprimaParser.getNameFromPattern
          .getCall(index)
          .calledWithExactly(param)
      ).to.be.true
    }
  })

  it('should return an array of parsed params', () => {
    const expectedResult = []

    for (const param of params) {
      const parsedParam = `parsed${param}`

      esprimaParser.getNameFromPattern
        .withArgs(param)
          .returns(parsedParam)
      expectedResult.push(parsedParam)
    }

    const result = esprimaParser.parseParams(params)

    expect(result).to.be.eql(expectedResult)
  })
})
