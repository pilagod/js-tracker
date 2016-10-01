describe('parseFunctionParams tests', () => {
  const params = ['param1', 'param2', 'param3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getNameFromPattern')
  })

  it('should call getNameFromPattern with each given param', () => {
    esprimaParser.parseFunctionParams(params)

    for (const [index, param] of params.entries()) {
      expect(
        esprimaParser.getNameFromPattern
          .getCall(index)
          .calledWithExactly(param)
      ).to.be.true
    }
  })

  it('should return an array of parsed params\' name', () => {
    const expectedResult = []

    for (const param of params) {
      const parsedParam = `parsed${param}`

      esprimaParser.getNameFromPattern
        .withArgs(param)
          .returns(parsedParam)
      expectedResult.push(parsedParam)
    }

    const result = esprimaParser.parseFunctionParams(params)

    expect(result).to.be.eql(expectedResult)
  })
  // const params = ['param1', 'param2', 'param3']
  // const paramsName = ['result1', 'result2', 'result3']
  //
  // beforeEach(() => {
  //   sandbox.stub(esprimaParser, 'parseCalledParamsName')
  //     .returns(paramsName)
  // })
  //
  // it('should call parseCalledParamNames with given params', () => {
  //   esprimaParser.parseFunctionParams(params)
  //
  //   expect(
  //     esprimaParser.parseCalledParamsName
  //       .calledWithExactly(params)
  //   ).to.be.true
  // })
  //
  // it('should return an Array of paramNames concating \'arguments\' string', () => {
  //   const result = esprimaParser.parseFunctionParams(params)
  //
  //   expect(result).to.be.eql(paramsName.concat('arguments'))
  // })
})
