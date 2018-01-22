import { hash } from '../src/tracker/public/utils'

export function createAction(
  trackid: TrackID,
  type: ActionType,
  scriptUrl: string,
  lineNumber: number,
  columnNumber: number,
  code: string,
): { info: ActionInfo, record: ActionRecord } {
  const loc = { scriptUrl, lineNumber, columnNumber }

  return {
    info: { trackid, type, loc },
    record: {
      key: hash(`${scriptUrl}:${lineNumber}:${columnNumber}`),
      type, loc, code
    }
  }
}