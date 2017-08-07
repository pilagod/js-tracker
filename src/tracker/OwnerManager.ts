/// <reference path='./OwnerManager.d.ts'/>

const symbolOwner = Symbol('owner')
const OwnerManager: IOwnerManager = {
  defineOwnerOf(target, descriptor) {
    return Reflect.defineProperty(target, symbolOwner, descriptor)
  },
  getOwnerOf(target) {
    return Reflect.get(target, symbolOwner)
  },
  hasOwner(target) {
    return !!(this.getOwnerOf(target))
  }
}
export default OwnerManager