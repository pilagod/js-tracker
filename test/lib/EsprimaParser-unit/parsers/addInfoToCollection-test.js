describe('addInfoToCollection tests', () => {
  const exp =  {
    caller: {},
    callee: 'callee',
    info: {}
  }
  const status = {
    type: 'type'
  }
  // stub results
  const elements = ['element1', 'element2', 'element3']

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getTargetElements').returns(elements)
    sandbox.stub(esprimaParser, 'collection', {
      addInfoToElements: sandbox.spy()
    })
  })

  it('should call getTargetElements with exp.caller and status', () => {
    esprimaParser.addInfoToCollection(exp, status)

    expect(
      esprimaParser.getTargetElements
        .calledWithExactly(exp.caller, status)
    ).to.be.true
  })

  it('should call collection.addInfoToElements with and object containing elements of result from getTargetElements, type of status.type and info of exp.info', () => {
    esprimaParser.addInfoToCollection(exp, status)

    expect(
      esprimaParser.collection.addInfoToElements
        .calledWithExactly({
          elements: elements,
          type: status.type,
          info: exp.info
        })
    ).to.be.true
  })
})
