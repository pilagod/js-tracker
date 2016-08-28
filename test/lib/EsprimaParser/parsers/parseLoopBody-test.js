describe('parseLoopBody tests', () => {
  const body = 'body'
  // stub results
  const result = 'resultFromParseNode'
  const state = 'resultFromResetLoopState'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode')
      .returns(result)
    sandbox.stub(esprimaParser, 'resetLoopState')
      .returns(state)
  })

  it('should call parseNode with body', () => {
    esprimaParser.parseLoopBody(body)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(body)
    ).to.be.true
  })

  it('should call resetLoopState', () => {
    esprimaParser.parseLoopBody(body)

    expect(
      esprimaParser.resetLoopState
        .calledWithExactly()
    ).to.be.true
  })

  it('should return an object containing result from parseNode and resetLoopState', () => {
    const object = esprimaParser.parseLoopBody(body)

    expect(object).to.be.eql({result, state})
  })
})
