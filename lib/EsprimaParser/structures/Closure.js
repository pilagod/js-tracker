class Closure {
  constructor(data) {
    this.data = ((!!data) && (data.constructor === Object)) ?
      Object.assign({}, data) : {}
  }

  get(variable) {
    if (this.exist(variable)) {
      return this.data[variable]
    }
    return undefined
  }

  set(variable, value) {
    this.data[variable] = value
  }

  exist(variable) {
    return this.data.hasOwnProperty(variable)
  }
}

module.exports = Closure
