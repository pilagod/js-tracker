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

  isReturnState(state = this.state) {
    return state === FlowState.RETURN
  }

  isBreakState(state = this.state) {
    return state === FlowState.BREAK
  }

  isContinueState(state = this.state) {
    return state === FlowState.CONTINUE
  }

  isEitherState(state = this.state) {
    return (
      this.isReturnState(state) ||
      this.isBreakState(state) ||
      this.isContinueState(state)
    )
  }

  isLoopBreakState(state = this.state) {
    return (
      this.isReturnState(state) ||
      this.isBreakState(state)
    )
  }

  isLoopContinueState(state = this.state) {
    return this.isContinueState(state)
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
