/// <reference path='ActionTypes.d.ts'/>
/// <reference path='tracker.d.ts'/>

type ActionRecord = {
  type: ActionTypes;
  source: Source;
}

type Source = {
  loc: string;
  code: string;
}

interface IActionStore {
  get(
    trackid: TrackID
  ): ActionRecord[];

  register(
    trackid: TrackID,
    record: ActionRecord
  ): void;

  registerFromActionInfo(
    info: ActionInfo
  ): void;
}

interface IStore {
  add(
    trackid: TrackID,
    record: ActionRecord
  ): void

  get(
    trackid: TrackID
  ): ActionRecord[]
}

interface ILocMap {
  add(
    trackid: TrackID,
    loc: string
  ): void;

  has(
    trackid: TrackID,
    loc: string
  ): boolean;
}

interface IScriptCache {
  add(
    scriptUrl: string,
    scriptText: string
  ): void;

  get(
    scriptUrl: string,
    lineNumber: number,
    columnNumber: number
  ): string;

  has(
    scriptUrl: string
  ): boolean;
}