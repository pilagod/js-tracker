describe('parseCallee tests', () => {
  let callee
  // stub results
  const exp = {
    caller: {caller: 'caller'},
    callee: {callee: 'callee'}
  }
  const calleeInstance = {}

  beforeEach(() => {
    callee = createAstNode('Expression')

    sandbox.stub(esprimaParser, 'getCalleeExp').returns(exp)
    sandbox.stub(esprimaParser, 'createCallee').returns(calleeInstance)
  })

  it('should call getCalleeExp with callee', () => {
    esprimaParser.parseCallee(callee)

    expect(
      esprimaParser.getCalleeExp
        .calledWithExactly(callee)
    ).to.be.true
  })

  it('should return an object containing caller of exp.caller and callee of result from createCallee called with exp.callee', () => {
    const result = esprimaParser.parseCallee(callee)

    expect(
      esprimaParser.createCallee
        .calledWithExactly(exp.callee)
    ).to.be.true
    expect(result).to.be.eql({
      caller: exp.caller,
      callee: calleeInstance
    })
  })
})
