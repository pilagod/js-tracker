class Closure {
  constructor(data) {
    if (Closure.isObject(data)) {
      this.data = data
    } else {
      this.data = {}
    }
  }

  get(variable) {
    // prototype property would be ignored,
    // but before getting prototype property should get parent object first,
    // and parent object must be in own property
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

  static isObject(object) {
    const objectToString = Object.prototype.toString.call(object)

    return (
      objectToString === '[object Object]' ||
      objectToString === '[object Window]' ||
      objectToString === '[object global]'
    )
  }
}

module.exports = Closure
