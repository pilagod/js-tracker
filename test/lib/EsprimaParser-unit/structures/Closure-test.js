describe('Closure tests', () => {
  let Closure

  before(() => {
    Closure = require(`${libDir}/structures/Closure`)
  })

  describe('constructor tests', () => {
    it('should set data to given data', () => {
      const data = {data: 'data'}
      const closure = new Closure(data)

      expect(closure.data).to.be.eql(data)
    })

    it('should set data to empty object given no data', () => {
      const closure = new Closure()

      expect(closure.data).to.be.eql({})
    })
  })

  describe('methods tests', () => {
    let closure

    beforeEach(() => {
      closure = new Closure({
        'a': 1
      })
    })

    describe('get tests', () => {
      it('should return variable value given variable in closure.data', () => {
        const result = closure.get('a')

        expect(result).to.be.equal(1)
      })

      it('should return undefined given variable is not in closure.data', () => {
        const result = closure.get('b')

        expect(result).to.be.undefined
      })
    })

    describe('set tests', () => {
      it('should set variable as key and value as value to closure.data', () => {
        closure.set('b', 2)
        closure.set(undefined, 3)
        closure.set([1, 2, 3], 4)

        expect(closure.data['b']).to.be.equal(2)
        expect(closure.data[undefined]).to.be.equal(3)
        expect(closure.data['1,2,3']).to.be.equal(4)
      })
    })

    describe('exist tests', () => {
      it('should return true when given key is in closure.data', () => {
        const result = closure.exist('a')

        expect(result).to.be.true
      })

      it('should return false when given key is not in closure.data', () => {
        const result = closure.exist('b')

        expect(result).to.be.false
      })
    })
  })
})
