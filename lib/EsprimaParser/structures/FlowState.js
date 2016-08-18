const RETURN = 'RETURN'
const BREAK = 'BREAK'
const CONTINUE = 'CONTINUE'

class FlowState {
  constructor() {
    this.state = undefined
  }

  set(state) {
    if (this.isEitherState(state)) {
      this.state = state
    }
  }

  unset(state) {
    if (state === this.state) {
      this.state = undefined
    }
  }

  isEitherState(state = this.state) {
    return (
      state === FlowState.RETURN ||
      state === FlowState.BREAK ||
      state === FlowState.CONTINUE
    )
  }

  isLoopBreakState(state = this.state) {
    return (
      state === FlowState.RETURN ||
      state === FlowState.BREAK
    )
  }

  isLoopContinueState(state = this.state) {
    return state === FlowState.CONTINUE
  }

  static get RETURN() {
    return RETURN
  }

  static get BREAK() {
    return BREAK
  }

  static get CONTINUE() {
    return CONTINUE
  }
}

module.exports = FlowState
