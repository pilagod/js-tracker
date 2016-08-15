describe('createCalleeStack tests', () => {
  const data = ['data1']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'execute')
      .returns('resultFromExecute')
  })

  it('should call execute with data', () => {
    esprimaParser.createCalleeStack(data)

    expect(
      esprimaParser.execute
        .calledWithExactly(data)
    ).to.be.true
  })

  it('should return an array containing result from execute', () => {
    const result = esprimaParser.createCalleeStack(data)

    expect(result).to.be.eql(['resultFromExecute'])
  })
})
