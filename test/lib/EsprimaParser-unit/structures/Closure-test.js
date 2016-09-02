describe('Closure tests', () => {
  let Closure

  before(() => {
    Closure = require(`${libDir}/structures/Closure`)
  })

  describe('constructor tests', () => {
    beforeEach(() => {
      sandbox.stub(Closure, 'isObject')
    })

    it('should call isObject with given data', () => {
      const data = {}
      const result = new Closure(data)

      expect(
        Closure.isObject
          .calledWithExactly(data)
      ).to.be.true
    })

    it('should set property data to given data if isObject returns true', () => {
      const data = {'a': 1}

      Closure.isObject.withArgs(data).returns(true)

      const result = new Closure(data)

      expect(result.data).to.be.eql(data)
    })

    it('should set property data to empty object given isObject returns false', () => {
      const data = [1, 2, 3]

      Closure.isObject.withArgs(data).returns(false)

      const result = new Closure(data)

      expect(result.data).to.be.eql({})
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
      beforeEach(() => {
        sandbox.stub(closure, 'exist')
      })

      it('should return variable\'s value given variable is in closure', () => {
        closure.exist.withArgs('a').returns(true)

        const result = closure.get('a')

        expect(result).to.be.equal(1)
      })

      it('should return undefined given variable is not in closure', () => {
        closure.exist.withArgs('b').returns(false)

        const result = closure.get('b')

        expect(result).to.be.undefined
      })
    })

    describe('set tests', () => {
      it('should set variable as key and value as value to closure', () => {
        closure.set('b', 2)
        closure.set(undefined, 3)
        closure.set([1, 2, 3], 4)

        expect(closure.data['b']).to.be.equal(2)
        expect(closure.data[undefined]).to.be.equal(3)
        expect(closure.data['1,2,3']).to.be.equal(4)
      })
    })

    describe('exist tests', () => {
      it('should return true when given key is in closure', () => {
        const result = closure.exist('a')

        expect(result).to.be.true
      })

      it('should return false when given key is not in closure', () => {
        const result = closure.exist('b')

        expect(result).to.be.false
      })
    })
  })

  describe('static tests', () => {
    describe('isObject tests', () => {
      it('should return true given a plain object', () => {
        const result = Closure.isObject({})

        expect(result).to.be.true
      })

      it('should return true given a custom instance', () => {
        const result = Closure.isObject(new (class {})())

        expect(result).to.be.true
      })

      // nodejs environment
      it('should return true given [object global]', () => {
        const result = Closure.isObject(global)

        expect(result).to.be.true
      })

      // browser environment
      it('should return true given [object Window]', () => {
        const window = {}

        sandbox.stub(Object.prototype, 'toString')
          .returns('[object Window]')

        const result = Closure.isObject(window)

        expect(result).to.be.true
      })

      it('should return false given an array', () => {
        let results = []

        results.push(Closure.isObject([1, 2, 3]))
        results.push(Closure.isObject(new Array(1, 2, 3)))

        expect(results).to.be.eql([false, false])
      })

      it('should return false given a function', () => {
        let results = []

        results.push(Closure.isObject(function () {}))
        results.push(Closure.isObject(new Function()))

        expect(results).to.be.eql([false, false])
      })

      it('should return false given a string', () => {
        let results = []

        results.push(Closure.isObject('string'))
        results.push(Closure.isObject(new String('string')))

        expect(results).to.be.eql([false, false])
      })

      it('should return false given a number', () => {
        let results = []

        results.push(Closure.isObject(1))
        results.push(Closure.isObject(new Number(1)))

        expect(results).to.be.eql([false, false])
      })

      it('should return false given a undefined / null', () => {
        let results = []

        results.push(Closure.isObject(null))
        results.push(Closure.isObject(undefined))

        expect(results).to.be.eql([false, false])
      })
    })
  })
})
