/// <reference path='./types/SourceLocation.d.ts'/>

export function hashSourceLocation({ scriptUrl, lineNumber, columnNumber }: SourceLocation) {
  return hash(`${scriptUrl}:${lineNumber}:${columnNumber}`)
}

export function match(loc1: SourceLocation, loc2: SourceLocation) {
  return loc1.scriptUrl === loc2.scriptUrl
    && loc1.lineNumber === loc2.lineNumber
    && loc1.columnNumber === loc2.columnNumber
}

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
function hash(s: string): string {
  let hash = 0

  if (s.length !== 0) {
    for (let i = 0; i < s.length; i++) {
      hash = (((hash << 5) - hash) + s.charCodeAt(i)) | 0 // Convert to 32 bits integer
    }
  }
  return hash.toString(36)
}