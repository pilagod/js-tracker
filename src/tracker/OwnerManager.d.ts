/// <reference path='./index.d.ts'/>
/// <reference path='./ActionStore.d.ts'/>

interface Owner {
  getTrackID(): TrackID;
  getOwnerElement(): Element;
  hasTrackID(): boolean;
  isShadow(): boolean;
  setTrackID(): void;
}

// interface Owner {
//   readonly dataset: {
//     [key: string]: string;
//     // @NOTE: element using $0 to get in devtool can only access those 
//     // properties natively defined on the element, trackid can't be
//     // an alone extended property, so I store it on dataset 
//     _trackid?: TrackID;
//   };
//   _isShadow?: boolean;
// }

interface IOwnerManager {
  getOwner(this: IOwnerManager, target: ActionTarget): Owner;
  hasOwner(this: IOwnerManager, target: ActionTarget): boolean;
  hasShadowOwner(this: IOwnerManager, target: ActionTarget): boolean;
  setOwner(this: IOwnerManager, target: ActionTarget, ownerElement: Element): boolean;
  setOwnerByGetter(this: IOwnerManager, target: ActionTarget, ownerGetter: (context: ActionTarget) => Element): boolean;

  getTrackIDFromOwnerOf(this: IOwnerManager, target: ActionTarget): TrackID;
  // hasTrackIDOnOwnerOf(this: IOwnerManager, target: ActionTarget): boolean;
  // setTrackIDOnOwner(this: IOwnerManager, owner: Owner): boolean;
  // setTrackIDOnOwnerOf(this: IOwnerManager, target: ActionTarget): boolean;

  createShadowElement(this: IOwnerManager): Element;
}