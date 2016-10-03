class Closure {
  constructor(data = {}) {
    this.data = data
  }

  get(variable) {
    return this.data[variable]
  }

  set(variable, value) {
    this.data[variable] = value
  }

  exist(variable) {
    return this.data.hasOwnProperty(variable)
  }
}

module.exports = Closure
