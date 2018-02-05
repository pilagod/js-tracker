import Owner, { IOwner } from './Owner'
import { SymbolOwner } from './Symbols'

interface IOwnerManager {
  getOwner(target: ActionTarget): IOwner;
  hasOwner(target: ActionTarget): boolean;
  hasShadowOwner(target: ActionTarget): boolean;
  setOwner(target: ActionTarget, ownerElement: Element): boolean;
  setOwnerByGetter(target: ActionTarget, ownerGetter: (context: ActionTarget) => Element): boolean;
}

class OwnerManager implements IOwnerManager {

  public getOwner(target) {
    return <Owner>Reflect.get(target, SymbolOwner) || Owner.NullOwner
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
}
export default new OwnerManager()