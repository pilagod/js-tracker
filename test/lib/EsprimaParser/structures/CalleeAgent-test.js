describe('Method tests', () => {
  let CalleeAgent

  before(() => {
    CalleeAgent = require('../../../../lib/EsprimaParser/structures/CalleeAgent')
  })

  it('should pass this canary test', () => {
    expect(true).to.be.true
  })

  describe('constructor tests', () => {
    it('should set property callee to given callee and arguments to empty array', () => {
      const calleeAgent = new CalleeAgent('callee')

      expect(calleeAgent.callee).to.be.equal('callee')
      expect(calleeAgent.arguments).to.be.eql([])
    })
  })

  describe('methods tests', () => {
    let calleeAgent

    beforeEach(() => {
      calleeAgent = new CalleeAgent('callee')
    })

    describe('addArguments tests', () => {
      it('should push each element in given array to property arguments', () => {
        calleeAgent.setArguments([1, 2, 3])

        expect(calleeAgent.arguments).to.be.eql([1, 2, 3])
      })

      it('should concat results from different calls', () => {
        calleeAgent.setArguments([1, 2, 3])
        calleeAgent.setArguments([4, 5, 6])

        expect(calleeAgent.arguments).to.be.eql([1, 2, 3, 4, 5, 6])
      })
    })
  })
})
