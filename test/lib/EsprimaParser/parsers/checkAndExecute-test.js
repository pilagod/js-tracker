describe('checkAndExecute tests', () => {
  const data = ['data1', 'data2', 'data3']
  const info = {
    code: 'code',
    loc: 'loc'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'execute')
      .returns('resultFromExecute')
    sandbox.stub(esprimaParser, 'createCheckAndExecuteReducer')
      .returns('resultFromCreateCheckAndExecuteReducer')
    sandbox.stub(data, 'reduce')
      .returns('resultFromReduce')
  })

  it('should call execute with an array containing only first element in data', () => {
    esprimaParser.checkAndExecute(data, info)

    expect(
      esprimaParser.execute
        .calledWithExactly(['data1'])
    ).to.be.true
  })

  it('should call createCheckAndExecuteReducer with info', () => {
    esprimaParser.checkAndExecute(data, info)

    expect(
      esprimaParser.createCheckAndExecuteReducer
        .calledWithExactly(info)
    ).to.be.true
  })

  it('should call reduce of data with result from createCheckAndExecuteReducer and result from execute', () => {
    esprimaParser.checkAndExecute(data, info)

    expect(
      data.reduce
        .calledWithExactly(
          'resultFromCreateCheckAndExecuteReducer',
          'resultFromExecute'
        )
    ).to.be.true
  })

  it('should return result from reduce', () => {
    const result = esprimaParser.checkAndExecute(data, info)

    expect(result).to.be.equal('resultFromReduce')
  })
})
