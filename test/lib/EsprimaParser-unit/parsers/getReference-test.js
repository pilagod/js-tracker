describe('getReference tests', () => {
  const data = ['data1', 'data2', 'data3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'execute')
      .withArgs(data.slice(0, data.length - 1))
        .returns('resultFromExecute')
  })

  it('should return an object containing caller with result of execute data first length - 1 elements and callee with data last element', () => {
    const result = esprimaParser.getReference(data)

    expect(
      esprimaParser.execute
        .calledWithExactly(data.slice(0, data.length - 1))
    ).to.be.true
    expect(result).to.be.eql({
      caller: 'resultFromExecute',
      callee: data.slice(-1)[0]
    })
  })
})
