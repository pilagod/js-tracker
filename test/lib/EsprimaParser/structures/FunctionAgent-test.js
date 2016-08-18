describe('FunctionAgent tests', () => {
  const functionAgentInitArguments = {
    body: 'body',
    params: 'params',
    scriptUrl: 'scriptUrl',
    closureStack: 'closureStack'
  }
  let FunctionAgent

  before(() => {
    FunctionAgent = require('../../../../lib/EsprimaParser/structures/FunctionAgent')
  })

  it('should pass this canary test', () => {
    expect(true).to.be.true
  })

  describe('init tests', () => {
    it('should set instance properties properly with given init arguments', () => {
      const functionAgent = new FunctionAgent(functionAgentInitArguments)

      expect(functionAgent.body).to.be.equal(functionAgentInitArguments.body)
      expect(functionAgent.params).to.be.equal(functionAgentInitArguments.params)
      expect(functionAgent.scriptUrl).to.be.equal(functionAgentInitArguments.scriptUrl)
      expect(functionAgent.closureStack).to.be.equal(functionAgentInitArguments.closureStack)
    })
  })
})
