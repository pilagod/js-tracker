describe('FlowState tests', () => {
  const RETURN = 'RETURN'
  const BREAK = 'BREAK'
  const CONTINUE = 'CONTINUE'
  let FlowState

  before(() => {
    FlowState = require(`${libDir}/structures/FlowState`)
  })

  describe('constructor tests', () => {
    it('should set property state to undefined', () => {
      const flowState = new FlowState()

      expect(flowState.state).to.be.undefined
    })
  })

  describe('static tests', () => {
    describe('getter of RETURN', () => {
      it('should return string \'RETURN\'', () => {
        expect(FlowState.RETURN).to.be.equal(RETURN)
      })
    })

    describe('getter of BREAK', () => {
      it('should return string \'BREAK\'', () => {
        expect(FlowState.BREAK).to.be.equal(BREAK)
      })
    })

    describe('getter of CONTINUE', () => {
      it('should return string \'CONTINUE\'', () => {
        expect(FlowState.CONTINUE).to.be.equal(CONTINUE)
      })
    })
  })

  describe('methods tests', () => {
    let flowState

    beforeEach(() => {
      flowState = new FlowState()
    })

    describe('set tests', () => {
      beforeEach(() => {
        sandbox.stub(flowState, 'isEitherState')
      })

      it('should set state to argument state given isEitherStatus returns true', () => {
        flowState.isEitherState.returns(true)

        flowState.set(RETURN)

        expect(flowState.state).to.be.equal(RETURN)
      })

      it('should not set state to argument state given isEitherStatus returns false', () => {
        flowState.isEitherState.returns(false)

        flowState.set('STATE')

        expect(flowState.state).to.be.undefined
      })
    })

    describe('unset tests', () => {
      it('should set state to undefined given argument state equals to current state', () => {
        flowState.state = RETURN

        flowState.unset(RETURN)

        expect(flowState.state).to.be.undefined
      })

      it('should not set state to undefined given argument state not equal to current state', () => {
        flowState.state = RETURN

        flowState.unset(BREAK)

        expect(flowState.state).to.be.equal(RETURN)
      })
    })

    describe('isEitherState tests', () => {
      it('should return true if current state is RETURN / BREAK / CONTINUE', () => {
        const results = []

        // state: RETURN
        flowState.state = RETURN
        results.push(flowState.isEitherState())

        // state: BREAK
        flowState.state = BREAK
        results.push(flowState.isEitherState())

        // state: CONTINUE
        flowState.state = CONTINUE
        results.push(flowState.isEitherState())

        expect(results).to.be.eql([true, true, true])
      })

      it('should return false if current state is other than RETURN / BREAK / CONTINUE', () => {
        // state: undefined
        const result = flowState.isEitherState()

        expect(result).to.be.false
      })

      it('should return true if argument state is RETURN / BREAK / CONTINUE', () => {
        const results = []

        // state: RETURN
        results.push(flowState.isEitherState(RETURN))

        // state: BREAK
        results.push(flowState.isEitherState(BREAK))

        // state: CONTINUE
        results.push(flowState.isEitherState(CONTINUE))

        expect(results).to.be.eql([true, true, true])
      })

      it('should return false if argument state is other than RETURN / BREAK / CONTINUE', () => {
        const result = flowState.isEitherState(undefined)

        expect(result).to.be.false
      })
    })

    describe('isLoopBreakState tests', () => {
      it('should return true if current state is RETURN / BREAK', () => {
        const results = []

        // state: RETURN
        flowState.state = RETURN
        results.push(flowState.isLoopBreakState())

        // state: BREAK
        flowState.state = BREAK
        results.push(flowState.isLoopBreakState())

        // state: CONTINUE
        flowState.state = CONTINUE
        results.push(flowState.isLoopBreakState())

        expect(results).to.be.eql([true, true, false])
      })
    })

    describe('isLoopContinueState tests', () => {
      it('should return true only if current state is CONTINUE', () => {
        const results = []

        // state: RETURN
        flowState.state = RETURN
        results.push(flowState.isLoopContinueState())

        // state: BREAK
        flowState.state = BREAK
        results.push(flowState.isLoopContinueState())

        // state: CONTINUE
        flowState.state = CONTINUE
        results.push(flowState.isLoopContinueState())

        expect(results).to.be.eql([false, false, true])
      })
    })
  })
})
