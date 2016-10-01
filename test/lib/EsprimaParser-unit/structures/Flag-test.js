describe('Flag tests', () => {
  let Flag

  before(() => {
    Flag = require(`${libDir}/structures/Flag`)
  })

  describe('constructor tests', () => {
    it('should set data to given boolean', () => {
      const flag1 = new Flag(true)
      const flag2 = new Flag(false)

      expect(flag1.data).to.be.true
      expect(flag2.data).to.be.false
    })
  })

  describe('methods tests', () => {
    let flag

    describe('set tests', () => {
      beforeEach(() => {
        flag = new Flag(false)
      })

      it('should set flag.data to true', () => {
        flag.set()

        expect(flag.data).to.be.true
      })
    })

    describe('unset tests', () => {
      beforeEach(() => {
        flag = new Flag(true)
      })

      it('should set flag.data to false', () => {
        flag.unset()

        expect(flag.data).to.be.false
      })
    })

    describe('isSet tests', () => {
      beforeEach(() => {
        flag = new Flag(true)
      })

      it('should return flag.data', () => {
        const results = []

        // flag.data = true
        results.push(flag.isSet())

        // flag.data = false
        flag.data = false
        results.push(flag.isSet())

        expect(results).to.be.eql([true, false])
      })
    })
  })
})
