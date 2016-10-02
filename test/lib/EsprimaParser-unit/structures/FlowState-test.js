describe('FlowState tests', () => {
  const RETURN = 'RETURN'
  const BREAK = 'BREAK'
  const CONTINUE = 'CONTINUE'
  let FlowState

  before(() => {
    FlowState = require(`${libDir}/structures/FlowState`)
  })

  describe('constructor tests', () => {
    it('should set property state and label to null', () => {
      const flowState = new FlowState()

      expect(flowState.state).to.be.null
      expect(flowState.label).to.be.null
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

    /*************************/
    /*          set          */
    /*************************/

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

        expect(flowState.state).to.be.null
      })
    })

    describe('setReturn tests', () => {
      beforeEach(() => {
        sandbox.stub(flowState, 'set')
      })

      it('should call set with FlowState.RETURN', () => {
        flowState.setReturn()

        expect(
          flowState.set
            .calledWithExactly(FlowState.RETURN)
        ).to.be.true
      })
    })

    describe('setBreak tests', () => {
      beforeEach(() => {
        sandbox.stub(flowState, 'set')
      })

      it('should call set with FlowState.BREAK', () => {
        flowState.setBreak()

        expect(
          flowState.set
            .calledWithExactly(FlowState.BREAK)
        ).to.be.true
      })
    })

    describe('setContinue tests', () => {
      beforeEach(() => {
        sandbox.stub(flowState, 'set')
      })

      it('should call set with FlowState.CONTINUE', () => {
        flowState.setContinue()

        expect(
          flowState.set
            .calledWithExactly(FlowState.CONTINUE)
        ).to.be.true
      })
    })

    /*************************/
    /*         unset         */
    /*************************/

    describe('unset tests', () => {
      it('should set state to null given argument state equals to current state', () => {
        flowState.state = RETURN

        flowState.unset(RETURN)

        expect(flowState.state).to.be.null
      })

      it('should not set state to null given argument state not equal to current state', () => {
        flowState.state = RETURN

        flowState.unset(BREAK)

        expect(flowState.state).to.be.equal(RETURN)
      })
    })

    describe('unsetReturn tests', () => {
      beforeEach(() => {
        sandbox.stub(flowState, 'unset')
      })

      it('should call unset with FlowState.RETURN', () => {
        flowState.unsetReturn()

        expect(
          flowState.unset
            .calledWithExactly(FlowState.RETURN)
        ).to.be.true
      })
    })

    describe('unsetBreak tests', () => {
      beforeEach(() => {
        sandbox.stub(flowState, 'unset')
      })

      it('should call unset with FlowState.BREAK', () => {
        flowState.unsetBreak()

        expect(
          flowState.unset
            .calledWithExactly(FlowState.BREAK)
        ).to.be.true
      })
    })

    describe('unsetContinue tests', () => {
      beforeEach(() => {
        sandbox.stub(flowState, 'unset')
      })

      it('should call unset with FlowState.CONTINUE', () => {
        flowState.unsetContinue()

        expect(
          flowState.unset
            .calledWithExactly(FlowState.CONTINUE)
        ).to.be.true
      })
    })

    /*************************/
    /*     state checkers    */
    /*************************/

    describe('isReturnState tests', () => {
      it('should return true if current state is RETURN', () => {
        const results = []

        // state: RETURN
        flowState.state = RETURN
        results.push(flowState.isReturnState())

        expect(results).to.be.eql([true])
      })

      it('should return true if argument state is RETURN', () => {
        const results = []

        // state: RETURN
        results.push(flowState.isReturnState(RETURN))

        expect(results).to.be.eql([true])
      })

      it('should return false if current state is not RETURN', () => {
        const results = []

        // state: BREAK
        flowState.state = BREAK
        results.push(flowState.isReturnState())

        // state: CONTINUE
        flowState.state = CONTINUE
        results.push(flowState.isReturnState())

        expect(results).to.be.eql([false, false])
      })

      it('should return false if argument state is not RETURN', () => {
        const results = []

        // state: BREAK
        results.push(flowState.isReturnState(BREAK))

        // state: CONTINUE
        results.push(flowState.isReturnState(CONTINUE))

        expect(results).to.be.eql([false, false])
      })
    })

    describe('isBreakState tests', () => {
      it('should return true if current state is BREAK', () => {
        const results = []

        // state: BREAK
        flowState.state = BREAK
        results.push(flowState.isBreakState())

        expect(results).to.be.eql([true])
      })

      it('should return true if argument state is BREAK', () => {
        const results = []

        // state: BREAK
        results.push(flowState.isBreakState(BREAK))

        expect(results).to.be.eql([true])
      })

      it('should return false if current state is not BREAK', () => {
        const results = []

        // state: RETURN
        flowState.state = RETURN
        results.push(flowState.isBreakState())

        // state: CONTINUE
        flowState.state = CONTINUE
        results.push(flowState.isBreakState())

        expect(results).to.be.eql([false, false])
      })

      it('should return false if argument state is not BREAK', () => {
        const results = []

        // state: RETURN
        results.push(flowState.isBreakState(RETURN))

        // state: CONTINUE
        results.push(flowState.isBreakState(CONTINUE))

        expect(results).to.be.eql([false, false])
      })
    })

    describe('isContinueState tests', () => {
      it('should return true if current state is CONTINUE', () => {
        const results = []

        // state: CONTINUE
        flowState.state = CONTINUE
        results.push(flowState.isContinueState())

        expect(results).to.be.eql([true])
      })

      it('should return true if argument state is CONTINUE', () => {
        const results = []

        // state: CONTINUE
        results.push(flowState.isContinueState(CONTINUE))

        expect(results).to.be.eql([true])
      })

      it('should return false if current state is not CONTINUE', () => {
        const results = []

        // state: RETURN
        flowState.state = RETURN
        results.push(flowState.isContinueState())

        // state: BREAK
        flowState.state = BREAK
        results.push(flowState.isContinueState())

        expect(results).to.be.eql([false, false])
      })

      it('should return false if argument state is not CONTINUE', () => {
        const results = []

        // state: RETURN
        results.push(flowState.isContinueState(RETURN))

        // state: BREAK
        results.push(flowState.isContinueState(BREAK))

        expect(results).to.be.eql([false, false])
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

    /*************************/
    /*         label         */
    /*************************/

    describe('setLabel tests', () => {
      it('should set label to given label', () => {
        const label = 'label'

        flowState.setLabel(label)

        expect(flowState.label).to.be.equal(label)
      })
    })

    describe('unsetLabel tests', () => {
      it('should unset label to null', () => {
        flowState.label = 'label'

        flowState.unsetLabel()

        expect(flowState.label).to.be.null
      })
    })

    describe('isNullLabel tests', () => {
      it('should return true if label is null', () => {
        const result = flowState.isNullLabel()

        expect(result).to.be.true
      })

      it('should return false if label is not null', () => {
        flowState.label = 'label'

        const result = flowState.isNullLabel()

        expect(result).to.be.false
      })
    })

    describe('isLabelMatched tests', () => {
      it('should return false if label is null', () => {
        const result = flowState.isLabelMatched()

        expect(result).to.be.false
      })

      it('should return false if label is not null but label is not equal to argument label', () => {
        const label = 'label'
        const stateLabel = 'stateLabel'

        flowState.label = stateLabel

        const result = flowState.isLabelMatched(label)

        expect(result).to.be.false
      })

      it('should return true if label is not null and label is equal to argument label', () => {
        const label = 'label'

        flowState.label = label

        const result = flowState.isLabelMatched(label)

        expect(result).to.be.true
      })
    })
  })
})
