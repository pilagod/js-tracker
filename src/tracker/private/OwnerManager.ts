import ShadowElement from './ShadowElement'
import { setTrackID } from './NativeUtils'
import { SymbolOwner } from './Symbols'

interface IOwner {
  getTrackID(): TrackID;
  getElement(): Element;
  hasTrackID(): boolean;
  isShadow(): boolean;
  setTrackID(): void;
}

class Owner implements IOwner {

  static NullOwner = new (class extends Owner {
    constructor() {
      super(null)
    }
    isShadow() {
      return false
    }
  })()

  private element: Element

  /* public */

  constructor(element: Element) {
    this.element = element
  }

  public getTrackID() {
    return this.element.getAttribute('trackid')
  }

  public getElement() {
    return this.element
  }

  public hasTrackID() {
    return this.element.hasAttribute('trackid')
  }

  public isShadow() {
    return this.element instanceof ShadowElement
  }

  public setTrackID() {
    return !this.hasTrackID() && setTrackID(this.element)
  }
}

interface IOwnerManager {
  getOwner(this: IOwnerManager, target: ActionTarget): IOwner;
  hasOwner(this: IOwnerManager, target: ActionTarget): boolean;
  hasShadowOwner(this: IOwnerManager, target: ActionTarget): boolean;
  setOwner(this: IOwnerManager, target: ActionTarget, ownerElement: Element): boolean;
  setOwnerByGetter(this: IOwnerManager, target: ActionTarget, ownerGetter: (context: ActionTarget) => Element): boolean;
}

const OwnerManager: IOwnerManager = {
  getOwner(target) {
    return <Owner>Reflect.get(target, SymbolOwner) || Owner.NullOwner
  },

  hasOwner(target) {
    // @NOTE: Attr has owner but might be null (created by createAttribute)
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
          : Owner.NullOwner
      }
    })
  }
}
export default OwnerManager