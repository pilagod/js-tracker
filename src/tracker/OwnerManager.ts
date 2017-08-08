/// <reference path='./OwnerManager.d.ts'/>

const symbolOwner = Symbol('owner')
const OwnerManager: IOwnerManager = {
  defineOwner(target, descriptor) {
    return Reflect.defineProperty(target, symbolOwner, descriptor)
  },
  getOwner(target) {
    return Reflect.get(target, symbolOwner)
  },
  hasOwner(target) {
    return !!(this.getOwner(target))
  }
}
export default OwnerManager