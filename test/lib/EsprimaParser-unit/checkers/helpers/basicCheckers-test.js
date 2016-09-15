for (const type of ['call', 'prop']) {
  for (const subType of ['Event', 'Mani']) {
    describe(`${type}${subType}Checker tests`, () => {
      const method = 'method'
      const otherMethod = 'otherMethod'
      let checker

      before(() => {
        checker = require(`../${libDir}/checkers/helpers/${type}${subType}Checker`)
      })

      it('should return valid status given callee.method is in criteria', () => {
        const data = {
          criteria: {[method]: true},
          callee: (type === 'call') ? new Callee(method) : method,
        }
        const result = checker(data)

        expect(result).to.be.eql({
          type: (subType === 'Event') ? Collection.EVENT : Collection.MANIPULATION
        })
      })

      it(`should return status type: ${subType === 'Event' ? 'EVENT' : 'MANIPULATION'} when criteria matched`, () => {
        const data = {
          criteria: {[method]: true},
          callee: (type === 'call') ? new Callee(method) : method,
        }
        const result = checker(data)

        expect(result).to.have.property('type', (subType === 'Event') ? Collection.EVENT : Collection.MANIPULATION)
      })

      it('should return undefined when callee.method is not in criteria', () => {
        const data = {
          criteria: {[method]: true},
          callee: (type === 'call') ? new Callee(otherMethod) : otherMethod
        }
        const result = checker(data)

        expect(result).to.be.undefined
      })
    })
  }
}
