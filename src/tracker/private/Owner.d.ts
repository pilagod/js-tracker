/// <reference path='../public/ActionStore.d.ts'/>

interface Owner {
  getTrackID(): TrackID;
  getElement(): Element;
  hasTrackID(): boolean;
  isShadow(): boolean;
  setTrackID(): void;
}