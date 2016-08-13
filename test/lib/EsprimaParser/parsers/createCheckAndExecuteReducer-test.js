describe('createCheckAndExecuteReducer tests', () => {
  const info = {
    code: 'code',
    loc: 'loc'
  }

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'checkAndExecuteReducer')
      .returns('resultFromCheckAndExecuteReducer')
  })

  it('should return a function', () => {
    const result = esprimaParser.createCheckAndExecuteReducer(info)

    expect(result).to.be.instanceof(Function)
  })

  it('should return a function which will call checkAndExecuteReducer with info and all called args then return', () => {
    const args = ['pre', 'cur']
    const checkAndExecuteReducer = esprimaParser.createCheckAndExecuteReducer(info)

    const result = checkAndExecuteReducer(...args)

    expect(
      esprimaParser.checkAndExecuteReducer
        .calledWithExactly(info, ...args)
    ).to.be.true
    expect(result).to.be.equal('resultFromCheckAndExecuteReducer')
  })
})
