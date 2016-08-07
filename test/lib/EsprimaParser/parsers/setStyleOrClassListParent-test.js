describe('setStyleOrClassListParent tests', () => {
  const data = 'data'
  const executedData = 'executedData'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'isStyleOrClassList')
  })

  it('should call isStyleOrClassList with executedData', () => {
    esprimaParser.setStyleOrClassListParent(data, executedData)

    expect(
      esprimaParser.isStyleOrClassList
        .calledWithExactly(executedData)
    ).to.be.true
  })

  it('should call ')
})
