import { hash } from '../src/tracker/public/utils'

export function createActionRecord(
  type: ActionType,
  scriptUrl: string,
  lineNumber: number,
  columnNumber: number,
  code: string,
): ActionRecord {
  return {
    key: hash(`${scriptUrl}:${lineNumber}:${columnNumber}`),
    type: type,
    loc: { scriptUrl, lineNumber, columnNumber },
    code: code
  }
}