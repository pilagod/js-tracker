describe('propMani checker tests', () => {
  let Collection, checker

  before(() => {
    Collection = require(`../${libDir}/structures/Collection`)
    checker = require(`../${libDir}/checkers/CSSStyleDeclaration/prop/mani`)
  })

  it('should always return status type MANIPULATION', () => {
    const result = checker()

    expect(result).to.be.eql({type: Collection.MANIPULATION})
  })
})
