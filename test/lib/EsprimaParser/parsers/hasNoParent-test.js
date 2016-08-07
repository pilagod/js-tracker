describe('hasNoParent tests', () => {
  it('should call hasOwnProperty of executedData with \'parent\' and return', () => {
    const executedData = {
      hasOwnProperty: sandbox.stub().returns('resultFromHasOwnProperty')
    }
    const result = esprimaParser.hasNoParent(executedData)

    expect(
      executedData.hasOwnProperty
        .calledWithExactly('parent')
    ).to.be.true
    expect(result).to.be.equal('resultFromHasOwnProperty')
  })

  it('should work properly given non-object executedData', () => {
    const executedData = 1
    const result = esprimaParser.hasNoParent(executedData)

    expect(result).to.be.false
  })
})
