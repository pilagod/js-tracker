/// <reference path='./ActionType.d.ts'/>
/// <reference path='./TrackIDFactory.d.ts'/>
/// <reference path='../private/ActionMap.d.ts'/>

type ActionInfo = {
  trackid: TrackID,
  target: Target,
  action: Action,
  actionTag?: string,
  merge?: TrackID,
  stacktrace: StackTrace.StackFrame[]
}

type ActionRecord = {
  key: string;
  type: ActionType;
  source: Source;
}

type Source = {
  loc: {
    scriptUrl: string;
    lineNumber: number;
    columnNumber: number;
  }
  code: string;
}

interface IActionStore {
  get(
    trackid: TrackID
  ): ActionRecord[];

  register(
    trackid: TrackID,
    record: ActionRecord
  ): Promise<boolean>;

  registerFromActionInfo(
    info: ActionInfo
  ): Promise<boolean>;
}

interface IStore {
  add(
    trackid: TrackID,
    record: ActionRecord
  ): void;

  get(
    trackid: TrackID
  ): ActionRecord[];

  merge(
    from: TrackID,
    to: TrackID
  ): ActionRecord[];
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

  remove(
    trackid: TrackID,
    loc: string,
  ): void;
}

interface IScriptCache {
  add(
    scriptUrl: string,
    scriptPromise: Promise<string[]>
  ): void;

  get(
    scriptUrl: string,
    lineNumber: number,
    columnNumber: number
  ): Promise<string>;

  has(
    scriptUrl: string
  ): boolean;
}