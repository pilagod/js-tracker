describe('Callee tests', () => {
  const method = 'method'
  let Callee

  before(() => {
    Callee = require(`${libDir}/structures/Callee`)
  })

  describe('constructor tests', () => {
    it('should set property method to given method and arguments to empty array', () => {
      const callee = new Callee(method)

      expect(callee.method).to.be.equal(method)
      expect(callee.arguments).to.be.eql([])
    })
  })

  describe('methods tests', () => {
    let callee

    beforeEach(() => {
      callee = new Callee(method)
    })

    describe('addArguments tests', () => {
      it('should push each element in given array to property arguments', () => {
        callee.addArguments([1, 2, 3])

        expect(callee.arguments).to.be.eql([1, 2, 3])
      })

      it('should concat results from different calls', () => {
        callee.addArguments([1, 2, 3])
        callee.addArguments([4, 5, 6])

        expect(callee.arguments).to.be.eql([1, 2, 3, 4, 5, 6])
      })
    })
  })
})
