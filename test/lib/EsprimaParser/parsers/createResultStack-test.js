describe('createResultStack tests', () => {
  const data = ['data1']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'execute')
      .returns('resultFromExecute')
  })

  it('should call execute with data', () => {
    esprimaParser.createResultStack(data)

    expect(
      esprimaParser.execute
        .calledWithExactly(data)
    ).to.be.true
  })

  it('should return an array containing result from execute', () => {
    const result = esprimaParser.createResultStack(data)

    expect(result).to.be.eql(['resultFromExecute'])
  })
})
