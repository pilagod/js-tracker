class test2 {
  constructor(test) {
    this.test = test
  }
  tempB() {
    console.log(this.test);
    return this.test.tempD()
  }
}

class test {
  constructor() {
    this.a = 1
  }
}

let testClass = new test()

Object.assign(test.prototype, {
  tempA() {
    const tempC = new test2(testClass)
    return tempC.tempB()
  },
  tempD() {
    return this.a
  }
})

console.log(testClass.tempA())
