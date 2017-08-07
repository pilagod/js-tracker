/// <reference path='./index.d.ts'/>

interface IOwnerManager {
  defineOwnerOf(target: ActionTarget, descriptor: PropertyDescriptor): void;
  getOwnerOf(target: ActionTarget): Owner;
  hasOwner(target: ActionTarget): boolean;
}