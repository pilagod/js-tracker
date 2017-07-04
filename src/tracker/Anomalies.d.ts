/// <reference path='./tracker.d.ts'/>

interface IAnomalies {
  has(target: Target, action: Action): boolean;
}