class FlowStatus {
  // @TODO: get()
  // @TODO: set('return'/'break'/'continue')
  // @TODO: unset() -> null

  // @TODO: isReturnStatus
  // @TODO: isBreakStatus
  // @TODO: isContinueStatus

  // @TODO: isEitherStatus
  // @TODO: isLoopBreakStatus
  // @TODO: isLoopContinueStatus

  // @TODO: static get RETURN
  // @TODO: static get BREAK
  // @TODO: static get CONTINUE

  static get RETURN() {
    return 'RETURN'
  }

  static get BREAK() {
    return 'BREAK'
  }

  static get CONTINUE() {
    return 'CONTINUE'
  }
}

module.exports = FlowStatus
