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

      let closureStub

      beforeEach(() => {
        closureStub = {
          get: sandbox.stub()
            .withArgs(variable)
              .returns('resultFromClosureGet')
        }
        sandbox.stub(closureStack, 'findClosureByVariable')
          .withArgs(variable)
            .returns(closureStub)
      })

      it('should call findClosureByVariable with given variable', () => {
        closureStack.get(variable)

        expect(
          closureStack.findClosureByVariable
            .calledWithExactly(variable)
        ).to.be.true
      })

      it('should call get of closure returned from findClosureByVariable with given variable and return when closure is found', () => {
        const result = closureStack.get(variable)

        expect(result).to.be.equal('resultFromClosureGet')
      })

      it('should return undefined given findClosureByVariable returns undefined', () => {
        closureStack.findClosureByVariable
          .withArgs(variable)
            .returns(undefined)

        const result = closureStack.get(variable)

        expect(result).to.be.undefined
      })
    })

    describe('findClosureByVariable tests', () => {
      const variable = 'a'

      it('should return the first closure searched from stack behind whose method exist called with variable return true', () => {
        const closureStub1 = new Closure({name: 'closureStub1'})
        const closureStub2 = new Closure({name: 'closureStub2'})
        const closureStub3 = new Closure({name: 'closureStub3'})

        sandbox.stub(closureStub1, 'exist')
          .withArgs(variable)
            .returns(true)
        sandbox.stub(closureStub2, 'exist')
          .withArgs(variable)
            .returns(true)
        sandbox.stub(closureStub3, 'exist')
          .withArgs(variable)
            .returns(false)

        closureStack.stack.push(closureStub1, closureStub2, closureStub3)

        const result = closureStack.findClosureByVariable(variable)

        expect(result).to.be.equal(closureStub2)
      })

      it('should return undefined when variable is not found in any closure', () => {
        const closureStub = new Closure()

        sandbox.stub(closureStub, 'exist')
          .withArgs(variable)
            .returns(false)

        closureStack.stack = [closureStub]

        const result = closureStack.findClosureByVariable()

        expect(result).to.be.undefined
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
        sandbox.stub(closureStack, 'findClosureByVariable')
          .withArgs(variable)
            .returns(closureStub)
      })

      it('should call findClosureByVariable with given varaible', () => {
        closureStack.update(variable, value)

        expect(
          closureStack.findClosureByVariable
            .calledWithExactly(variable)
        ).to.be.true
      })

      it('should call set of closure returned from findClosureByVariable with given variable and value when closure is found', () => {
        closureStack.update(variable, value)

        expect(
          closureStub.set
            .calledWithExactly(variable, value)
        ).to.be.true
      })

      it('should not call set of closure when closure is not found', () => {
        closureStack.findClosureByVariable
          .withArgs(variable)
            .returns(undefined)

        closureStack.update(variable, value)

        expect(closureStub.set.called).to.be.false
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
