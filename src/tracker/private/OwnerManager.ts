/// <reference path='../public/types/TrackID.d.ts'/>

import Owner from './Owner'
import { SymbolOwner } from './Symbols'

interface IOwnerManager {
  getOwnerElement(target: ActionTarget): Element;
  getTrackIDFromItsOwner(target: ActionTarget): TrackID;
  getOrSetTrackIDOnItsOwner(target: ActionTarget): TrackID;
  hasOwner(target: ActionTarget): boolean;
  hasShadowOwner(target: ActionTarget): boolean;
  setOwner(target: ActionTarget, ownerElement: Element): boolean;
  setOwnerByGetter(target: ActionTarget, ownerGetter: (context: ActionTarget) => Element): boolean;
}

class OwnerManager implements IOwnerManager {

  /* public */

  public getOwnerElement(target) {
    return this.getOwner(target).getElement()
  }

  public getTrackIDFromItsOwner(target) {
    return this.getOwner(target).getTrackID()
  }

  public getOrSetTrackIDOnItsOwner(target) {
    const owner = this.getOwner(target)

    if (!owner.hasTrackID()) {
      owner.setTrackID()
    }
    return owner.getTrackID()
  }

  public hasOwner(target) {
    // @NOTE: Attr has owner but might be null (created by createAttribute)
    return this.getOwner(target) !== Owner.NullOwner
  }

  public hasShadowOwner(target) {
    return this.getOwner(target).isShadow()
  }

  public setOwner(target, ownerElement) {
    return (function (owner) {
      return Reflect.defineProperty(target, SymbolOwner, {
        get: () => owner
      })
    })(new Owner(ownerElement))
  }

  public setOwnerByGetter(target, ownerGetter) {
    return Reflect.defineProperty(target, SymbolOwner, {
      get: function () {
        const ownerElement = ownerGetter(this)
        // @NOTE: for those Attr created by createAttribute, 
        // its owner might be null instead of Element
        return ownerElement instanceof Element
          ? new Owner(ownerElement)
          : Owner.NullOwner
      }
    })
  }

  /* private */

  public getOwner(target) {
    return <Owner>Reflect.get(target, SymbolOwner) || Owner.NullOwner
  }
}
export default <IOwnerManager>new OwnerManager()