describe('ClosureStack tests', () => {
  let Closure, ClosureStack

  beforeEach(() => {
    Closure = require(`${libDir}/structures/Closure`)
    ClosureStack = require(`${libDir}/structures/ClosureStack`)
  })

  describe('constructor tests', () => {
    it('should init property stack as an array containing only one closure init with context', () => {
      const closureStack = new ClosureStack(global)
      const closure = new Closure(global)

      expect(closureStack.stack.length).to.be.equal(1)
      expect(closureStack.stack[0]).to.be.instanceof(Closure)
      expect(closureStack.stack[0]).to.be.eql(closure)
    })
  })

  describe('methods tests', () => {
    let closureStack

    beforeEach(() => {
      closureStack = new ClosureStack(global)
    })

    describe('get tests', () => {
      const variable = 'a'
      const value = 1
      let closureStub

      beforeEach(() => {
        closureStub = {
          get: sandbox.stub()
            .withArgs(variable).returns(value)
        }
        sandbox.stub(closureStack, 'findClosure')
          .withArgs(variable).returns(closureStub)
      })

      it('should call findClosure with given variable', () => {
        closureStack.get(variable)

        expect(
          closureStack.findClosure
            .calledWithExactly(variable)
        ).to.be.true
      })

      it('should return result from get of closure returned from findClosure called with variable', () => {
        const result = closureStack.get(variable)

        expect(
          closureStub.get
            .calledWithExactly(variable)
        ).to.be.true
        expect(result).to.be.equal(value)
      })
    })

    describe('findClosure tests', () => {
      const variable = 'a'

      beforeEach(() => {
        sandbox.stub(closureStack, 'findFirstMatchedClosure')
        sandbox.stub(closureStack, 'getContextClosure')
      })

      it('should call findFirstMatchedClosure with variable', () => {
        closureStack.findClosure(variable)

        expect(
          closureStack.findFirstMatchedClosure
            .calledWithExactly(variable)
        ).to.be.true
      })

      it('should return closure from findFirstMatchedClosure called with variable given it returns a valid closure', () => {
        const closure = {data: 'data'}

        closureStack.findFirstMatchedClosure
          .withArgs(variable).returns(closure)

        const result = closureStack.findClosure(variable)

        expect(result).to.be.equal(closure)
      })

      it('should return result from getContextClosure given findFirstMatchedClosure returns undefined', () => {
        const contextClosure = {data: 'context data'}

        closureStack.findFirstMatchedClosure
          .withArgs(variable).returns(undefined)
        closureStack.getContextClosure.returns(contextClosure)

        const result = closureStack.findClosure(variable)

        expect(closureStack.getContextClosure.called).to.be.true
        expect(result).to.be.equal(contextClosure)
      })
    })

    describe('findFirstMatchedClosure tests', () => {
      const variable = 'a'
      let closure1, closure2, closure3

      beforeEach(() => {
        closure1 = new Closure({name: 'closure1'})
        closure2 = new Closure({name: 'closure2'})
        closure3 = new Closure({name: 'closure3'})

        sandbox.stub(closure1)
        sandbox.stub(closure2)
        sandbox.stub(closure3)
        sandbox.stub(closureStack.stack[0])

        closureStack.stack.push(closure1, closure2, closure3)
      })

      it('should return undefined given no closure other than context closure has the variable', () => {
        closure1.exist.withArgs(variable).returns(false)
        closure2.exist.withArgs(variable).returns(false)
        closure3.exist.withArgs(variable).returns(false)

        const result = closureStack.findFirstMatchedClosure(variable)

        expect(closureStack.stack[0].exist.called).to.be.false
        expect(result).to.be.undefined
      })

      it('should return first matched closure from stack behind which containing the given variable', () => {
        closure1.exist.withArgs(variable).returns(true)
        closure2.exist.withArgs(variable).returns(true)
        closure3.exist.withArgs(variable).returns(false)

        const result = closureStack.findFirstMatchedClosure(variable)

        expect(result).to.be.equal(closure2)
      })
    })

    describe('set tests', () => {
      let closureStub

      beforeEach(() => {
        closureStub = {
          set: sandbox.spy()
        }
        sandbox.stub(closureStack, 'getLatestClosure')
          .returns(closureStub)
      })

      it('should call getLatestClosure', () => {
        closureStack.set('a', 1)

        expect(closureStack.getLatestClosure.called).to.be.true
      })

      it('should call set of result from getLatestClosure with given variable and value', () => {
        closureStack.set('a', 1)

        expect(
          closureStub.set
            .calledWithExactly('a', 1)
        ).to.be.true
      })
    })

    describe('getLatestClosure tests', () => {
      it('should return last closure in stack', () => {
        const closure = new Closure()

        closureStack.stack.push(closure)

        const result = closureStack.getLatestClosure()

        expect(result).to.be.equal(closure)
      })
    })

    describe('update tests', () => {
      const variable = 'a'
      const value = 1
      let closureStub

      beforeEach(() => {
        closureStub = {
          set: sandbox.spy()
        }
        sandbox.stub(closureStack, 'findClosure')
          .withArgs(variable).returns(closureStub)
      })

      it('should call findClosure with given variable', () => {
        closureStack.update(variable, value)

        expect(
          closureStack.findClosure
            .calledWithExactly(variable)
        ).to.be.true
      })

      it('should call set of closure returned from findClosure with given variable and value', () => {
        closureStack.update(variable, value)

        expect(
          closureStub.set
            .calledWithExactly(variable, value)
        ).to.be.true
      })
    })

    describe('getContextClosure tests', () => {
      it('should return the first closure in stack', () => {
        const result = closureStack.getContextClosure()

        expect(result).to.be.equal(closureStack.stack[0])
      })
    })

    describe('createClosure tests', () => {
      it('should push empty closure to stack', () => {
        const closure = new Closure()

        closureStack.createClosure()

        const latestClosure = closureStack.stack.slice(-1)[0]

        expect(closureStack.stack.length).to.be.equal(2)
        expect(latestClosure).to.be.instanceof(Closure)
        expect(latestClosure).to.be.eql(closure)
      })
    })

    describe('getClone tests', () => {
      beforeEach(() => {
        sandbox.stub(closureStack, 'constructor', function () {
          this.setContext = sandbox.spy()
          this.setStack = sandbox.spy()
        })
      })

      it('should return an instanceof closureStack\'s constructor', () => {
        const newClosureStack = closureStack.getClone()

        expect(newClosureStack).to.be.instanceof(closureStack.constructor)
      })

      it('should call setStack with calling closureStack stack', () => {
        const newClosureStack = closureStack.getClone()

        expect(
          newClosureStack.setStack
            .calledWithExactly(closureStack.stack)
        ).to.be.true
      })
    })

    describe('setStack tests', () => {
      it('should set stack to a copied of given stack', () => {
        const stack = [
          new Closure({name: 'closure1'}),
          new Closure({name: 'closure2'})
        ]

        closureStack.setStack(stack)

        expect(closureStack.stack).to.be.eql(stack)
        expect(closureStack.stack).to.not.equal(stack)
      })

      it('should set stack to a copied of given stack, manipulation on copied stack would not affect original stack', () => {
        const stack = [
          new Closure({name: 'closure1'}),
          new Closure({name: 'closure2'})
        ]

        closureStack.setStack(stack)
        closureStack.stack.push(new Closure({name: 'closure3'}))

        expect(stack.length).to.be.equal(2)
        expect(closureStack.stack.length).to.be.equal(3)
      })
    })
  })
})
