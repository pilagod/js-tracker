class Flag {
  constructor(bool) {
    this.data = bool
  }

  set() {
    this.data = true
  }

  unset() {
    this.data = false
  }

  isSet() {
    return this.data
  }
}

module.exports = Flag
