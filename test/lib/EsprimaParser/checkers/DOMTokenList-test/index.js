describe('DOMTokenList checker tests', () => {
  const libDir = '../../../../../lib/EsprimaParser'
  const { Collection } = require(`${libDir}/checkers/init-helper`)
  const DOMTokenListChecker = require(`${libDir}/checkers/DOMTokenList`)

  describe('dispatch tests', () => {
    const DOMTokenList = function () {}

    it('should return status of type Collection.MANIPULATINO and execute undefined given data.caller is instanceof DOMTokenList', () => {
      const data = {
        context: {DOMTokenList},
        caller: new DOMTokenList()
      }
      const result = DOMTokenListChecker.dispatch(data)

      expect(result).to.be.eql({
        type: Collection.MANIPULATION,
        execute: undefined
      })
    })

    it('should return undefined given data.caller is not instanceof DOMTokenList', () => {
      const data = {
        context: {DOMTokenList},
        caller: {}
      }
      const result = DOMTokenListChecker.dispatch(data)

      expect(result).to.be.undefined
    })
  })
})
