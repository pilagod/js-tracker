/// <reference path='./index.d.ts'/>
/// <reference path='./ActionStore.d.ts'/>

interface Owner {
  readonly dataset: {
    [key: string]: string;
    // @NOTE: element using $0 to get in devtool can only access those 
    // properties natively defined on the element, trackid can't be
    // an alone extended property, so I store it on dataset 
    _trackid?: TrackID;
  };
  _isShadow?: boolean;
}

interface IOwnerManager {
  defineOwner(this: IOwnerManager, target: ActionTarget, descriptor: PropertyDescriptor): boolean;
  getOwner(this: IOwnerManager, target: ActionTarget): Owner;
  hasOwner(this: IOwnerManager, target: ActionTarget): boolean;

  getTrackIDFromOwner(this: IOwnerManager, owner: Owner): TrackID;
  getTrackIDFromOwnerOf(this: IOwnerManager, target: ActionTarget): TrackID;
  hasTrackIDOnOwnerOf(this: IOwnerManager, target: ActionTarget): boolean;
  setTrackIDOnOwner(this: IOwnerManager, owner: Owner): boolean;
  setTrackIDOnOwnerOf(this: IOwnerManager, target: ActionTarget): boolean;
}