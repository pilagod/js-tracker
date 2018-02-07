/// <reference path='../types/ActionStore.d.ts'/>

export function match(loc1: SourceLocation, loc2: SourceLocation) {
  return loc1.scriptUrl === loc2.scriptUrl
    && loc1.lineNumber === loc2.lineNumber
    && loc1.columnNumber === loc2.columnNumber
}