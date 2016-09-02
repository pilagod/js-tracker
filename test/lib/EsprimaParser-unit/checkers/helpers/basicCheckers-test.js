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

      it(`should return status type: ${subType === 'Event' ? 'EVENT' : 'MANIPULATION'} concated with statusData when all criteria matched`, () => {
        const data = {
          criteria: {[method]: true},
          callee: (type === 'call') ? new Callee(method) : method,
          statusData: {
            execute: 'execute',
            passive: 'passive'
          }
        }
        const result = checker(data)

        expect(result).to.be.eql({
          type: (subType === 'Event') ? Collection.EVENT : Collection.MANIPULATION,
          execute: 'execute',
          passive: 'passive'
        })
      })

      it('should return status only with type and properties in statusData when all criteria matched', () => {
        const data = {
          criteria: {[method]: true},
          callee: (type === 'call') ? new Callee(method) : method,
          statusData: {execute: undefined}
        }
        const result = checker(data)

        expect(result).to.have.property('type')
        expect(result).to.have.property('execute')
        expect(result).to.not.have.property('passive')
      })

      it('should return undefined when when callee.method is not in criteria', () => {
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
