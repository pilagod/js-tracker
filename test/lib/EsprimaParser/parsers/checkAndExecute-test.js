describe('checkAndExecute tests', () => {
  const data = ['data1', 'data2', 'data3']
  const info = {
    code: 'code',
    loc: 'loc'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'createCalleeStack')
      .returns('resultCreateCalleeStack')
    sandbox.stub(esprimaParser, 'createCheckAndExecuteReducer')
      .returns('resultFromCreateCheckAndExecuteReducer')
    sandbox.stub(data, 'reduce')
    sandbox.stub(esprimaParser, 'getLastElement')
      .returns('resultFromGetLastElement')
  })

  it('should call createCalleeStack with an array containing first element of data', () => {
    esprimaParser.checkAndExecute(data, info)

    expect(
      esprimaParser.createCalleeStack
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

  it('should call reduce of data with result from createCheckAndExecuteReducer and result from createCalleeStack', () => {
    esprimaParser.checkAndExecute(data, info)

    expect(
      data.reduce
        .calledWithExactly(
          'resultFromCreateCheckAndExecuteReducer',
          'resultCreateCalleeStack'
        )
    ).to.be.true
  })

  it('should call getLastElement with resultCreateCalleeStack and return', () => {
    const result = esprimaParser.checkAndExecute(data, info)

    expect(
      esprimaParser.getLastElement
        .calledWithExactly('resultCreateCalleeStack')
    ).to.be.true
    expect(result).to.be.equal('resultFromGetLastElement')
  })
})
