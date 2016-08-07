describe('executeExpression tests', () => {
  let data

  beforeEach(() => {
    data = {
      reduce: sandbox.stub()
        .returns('resultFromReduceOfData')
    }

    sandbox.stub(esprimaParser, 'setStyleOrDOMTokenListParent')
  })

  it('should call reduce of data with executeReducer and undefined', () => {
    esprimaParser.executeExpression(data)

    expect(
      data.reduce
        .calledWithExactly(esprimaParser.executeReducer, undefined)
    ).to.be.true
  })

  it('should call setStyleOrDOMTokenListParent with origin data and result from reduce of data', () => {
    esprimaParser.executeExpression(data)

    expect(
      esprimaParser.setStyleOrDOMTokenListParent
        .calledWithExactly(data, 'resultFromReduceOfData')
    ).to.be.true
  })

  it('should return result from reduce of data', () => {
    const result = esprimaParser.executeExpression(data)

    expect(result).to.be.equal('resultFromReduceOfData')
  })
})
