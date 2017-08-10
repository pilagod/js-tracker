/// <reference path='./OwnerManager.d.ts'/>

import Owner from './Owner'

const SymbolOwner = Symbol('owner')
const OwnerManager: IOwnerManager = {

  createShadowElement() {
    return document.createElement('shadow-element')
  },

  getOwner(target) {
    return <Owner>Reflect.get(target, SymbolOwner) || Owner.NullOwner
  },

  getTrackIDFromOwnerOf(target) {
    return this.getOwner(target).getTrackID()
  },

  hasOwner(target) {
    // @NOTE: Attr has owner but might be null
    return this.getOwner(target) !== Owner.NullOwner
  },

  hasShadowOwner(target) {
    return this.getOwner(target).isShadow()
  },

  setOwner(target, ownerElement) {
    return (function (owner) {
      return Reflect.defineProperty(target, SymbolOwner, {
        get: () => owner
      })
    })(new Owner(ownerElement))
  },

  setOwnerByGetter(target, ownerGetter) {
    return Reflect.defineProperty(target, SymbolOwner, {
      get: function () {
        const ownerElement = ownerGetter(this)
        // @NOTE: for those Attr created by createAttribute, 
        // its owner might be null instead of Element
        return ownerElement instanceof Element
          ? new Owner(ownerElement)
          : undefined
      }
    })
  }
}
export default OwnerManager