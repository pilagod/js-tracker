/// <reference path='./ActionMap.d.ts'/>

interface IAnomalies {
  has(
    target: Target,
    action: Action
  ): boolean;
}