describe('getLastElement tests', () => {
  const stack = ['data1', 'data2', 'data3']

  it('should return last element of given stack', () => {
    const result = esprimaParser.getLastElement(stack)

    expect(result).to.be.equal('data3')
  })
})
