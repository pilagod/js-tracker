describe('parseLoopBody tests', () => {
  const body = 'body'

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'parseNode')
      .returns('resultFromParseNode')
    sandbox.stub(esprimaParser, 'resetLoopState')
      .returns('resultFromResetLoopState')
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

  it('should return an array containing result from parseNode and resetLoopState', () => {
    const result = esprimaParser.parseLoopBody(body)

    expect(result).to.be.eql([
      'resultFromParseNode',
      'resultFromResetLoopState'
    ])
  })
})
