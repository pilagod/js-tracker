/// <reference path='./OwnerManager.d.ts'/>

import TrackIDManager, {
  Track_ID_Does_Not_Exist
} from './TrackIDManager'

const symbolOwner = Symbol('owner')

const OwnerManager: IOwnerManager = {

  defineOwner(target, descriptor) {
    return Reflect.defineProperty(target, symbolOwner, descriptor)
  },

  getOwner(target) {
    return <Owner>Reflect.get(target, symbolOwner)
  },

  hasOwner(target) {
    // @NOTE: Attr has owner but might be null
    return Reflect.has(target, symbolOwner) && !!(this.getOwner(target))
  },


  getTrackIDFromOwner(owner = { dataset: {} }) {
    return owner.dataset._trackid || Track_ID_Does_Not_Exist
  },

  getTrackIDFromOwnerOf(target) {
    return this.hasOwner(target)
      ? this.getTrackIDFromOwner(this.getOwner(target))
      : Track_ID_Does_Not_Exist
  },

  hasTrackIDOnOwnerOf(target) {
    return this.hasOwner(target) && Reflect.has(this.getOwner(target).dataset, '_trackid')
  },

  setTrackIDOnOwner(owner) {
    owner.dataset._trackid = <any>{
      value: (<any>TrackIDManager).generateID()
    }
    return true
  },

  setTrackIDOnOwnerOf(target) {
    return this.hasOwner(target)
      ? this.setTrackIDOnOwner(this.getOwner(target))
      : false
  }
}
export default OwnerManager