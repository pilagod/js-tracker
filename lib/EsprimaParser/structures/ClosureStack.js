class ClosureStack {
  constructor(context) {
    // this.context = context
    // default closure
  }
  // @TODO: get, set, update, getStack, createClosure
  // @TODO: getStack no need to renew a closure

  // @TODO: getStack
  // const test = class {
  //   constructor(data) {
  //     this.data = data
  //   }
  //   getCopy() {
  //     return new this.constructor([...this.data])
  //   }
  // }
  // const testObj = new test([1, 2, 3])
  // const testObj2 = testObj.getCopy()
  //
  // console.log(testObj.data);
  // console.log(testObj2.data);
  //
  // testObj.data[0] = 4
  //
  // console.log(testObj.data);
  // console.log(testObj2.data);
}

module.exports = ClosureStack
