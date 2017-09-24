/// <reference path='../index.d.ts'/>
/// <reference path='../public/ActionStore.d.ts'/>
/// <reference path='./Owner.d.ts'/>

interface IOwnerManager {
  getOwner(this: IOwnerManager, target: ActionTarget): Owner;
  hasOwner(this: IOwnerManager, target: ActionTarget): boolean;
  hasShadowOwner(this: IOwnerManager, target: ActionTarget): boolean;
  setOwner(this: IOwnerManager, target: ActionTarget, ownerElement: Element): boolean;
  setOwnerByGetter(this: IOwnerManager, target: ActionTarget, ownerGetter: (context: ActionTarget) => Element): boolean;
}