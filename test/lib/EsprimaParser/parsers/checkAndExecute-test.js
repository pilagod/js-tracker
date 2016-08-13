describe('checkAndExecute tests', () => {
  const data = ['data1', 'data2', 'data3']
  const info = {
    code: 'code',
    loc: 'loc'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'createResultStack')
      .returns('resultCreateResultStack')
    sandbox.stub(esprimaParser, 'createCheckAndExecuteReducer')
      .returns('resultFromCreateCheckAndExecuteReducer')
    sandbox.stub(data, 'reduce')
    sandbox.stub(esprimaParser, 'getLastElementOfStack')
      .returns('resultFromGetLastElementOfStack')
  })

  it('should call createResultStack with an array containing first element of data', () => {
    esprimaParser.checkAndExecute(data, info)

    expect(
      esprimaParser.createResultStack
        .calledWithExactly(['data1'])
    ).to.be.ture
  })

  it('should call createCheckAndExecuteReducer with info', () => {
    esprimaParser.checkAndExecute(data, info)

    expect(
      esprimaParser.createCheckAndExecuteReducer
        .calledWithExactly(info)
    ).to.be.true
  })

  it('should call reduce of data with result from createCheckAndExecuteReducer and result from createResultStack', () => {
    esprimaParser.checkAndExecute(data, info)

    expect(
      data.reduce
        .calledWithExactly(
          'resultFromCreateCheckAndExecuteReducer',
          'resultCreateResultStack'
        )
    ).to.be.true
  })

  it('should call getLastElementOfStack with resultCreateResultStack and return', () => {
    const result = esprimaParser.checkAndExecute(data, info)

    expect(
      esprimaParser.getLastElementOfStack
        .calledWithExactly('resultCreateResultStack')
    ).to.be.true
    expect(result).to.be.equal('resultFromGetLastElementOfStack')
  })
})
