describe('Method tests', () => {
  let Method

  before(() => {
    Method = require('../../../../lib/EsprimaParser/structures/Method')
  })

  it('should pass this canary test', () => {
    expect(true).to.be.true
  })

  describe('constructor tests', () => {
    it('should set property method to given method and arguments to empty array', () => {
      const methodInstance = new Method('method')

      expect(methodInstance.method).to.be.equal('method')
      expect(methodInstance.arguments).to.be.eql([])
    })
  })

  describe('methods tests', () => {
    let methodInstance

    beforeEach(() => {
      methodInstance = new Method('method')
    })

    describe('addArguments tests', () => {
      it('should push each element in given array to property arguments', () => {
        methodInstance.setArguments([1, 2, 3])

        expect(methodInstance.arguments).to.be.eql([1, 2, 3])
      })

      it('should concat results from different calls', () => {
        methodInstance.setArguments([1, 2, 3])
        methodInstance.setArguments([4, 5, 6])

        expect(methodInstance.arguments).to.be.eql([1, 2, 3, 4, 5, 6])
      })
    })
  })
})
