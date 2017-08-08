/// <reference path='./index.d.ts'/>

interface IOwnerManager {
  defineOwner(target: ActionTarget, descriptor: PropertyDescriptor): void;
  getOwner(target: ActionTarget): Owner;
  hasOwner(target: ActionTarget): boolean;
}