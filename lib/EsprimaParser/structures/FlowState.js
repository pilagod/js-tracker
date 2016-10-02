const RETURN = 'RETURN'
const BREAK = 'BREAK'
const CONTINUE = 'CONTINUE'

class FlowState {
  constructor() {
    this.state = null
    this.label = null
  }

  /*************************/
  /*          set          */
  /*************************/

  set(state) {
    if (this.isEitherState(state)) {
      this.state = state
    }
  }

  setReturn() {
    this.set(FlowState.RETURN)
  }

  setBreak() {
    this.set(FlowState.BREAK)
  }

  setContinue() {
    this.set(FlowState.CONTINUE)
  }

  /*************************/
  /*         unset         */
  /*************************/

  unset(state) {
    if (state === this.state) {
      this.state = null
    }
  }

  unsetReturn() {
    this.unset(FlowState.RETURN)
  }

  unsetBreak() {
    this.unset(FlowState.BREAK)
  }

  unsetContinue() {
    this.unset(FlowState.CONTINUE)
  }

  /*************************/
  /*     state checkers    */
  /*************************/

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

  /*************************/
  /*         label         */
  /*************************/

  setLabel(label) {
    this.label = label
  }

  unsetLabel() {
    this.label = null
  }

  isNullLabel() {
    return this.label === null
  }

  isLabelMatched(label) {
    return this.isNullLabel() ? false : (this.label === label)
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
