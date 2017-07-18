/// <reference path='ActionStore.d.ts'/>

import ActionMap from './ActionMap'

export default class ActionStore implements IActionStore {

  constructor() {
    this._store = new Store()
    this._locMap = new LocMap()
    this._scriptCache = new ScriptCache()
  }

  /* public */

  public get(trackid: TrackID): ActionRecord[] {
    return this._store.get(trackid)
  }

  public async register(trackid: TrackID, record: ActionRecord): Promise<void> {
    if (!this._locMap.has(trackid, record.source.loc)) {
      this._register(trackid, record)
    }
  }

  public async registerFromActionInfo(info: ActionInfo): Promise<void> {
    if (info.merge) {
      this._merge(info.merge, info.trackid)
    }
    const record: ActionRecord =
      await this._parseActionInfoIntoActionRecord(info)

    await this.register(info.trackid, record)
  }

  /* private */

  private _HTML_DOM_API_FRAME_INDEX = 2

  private _store: IStore
  private _locMap: ILocMap
  private _scriptCache: IScriptCache

  private _register(trackid: TrackID, record: ActionRecord): void {
    this._store.add(trackid, record)
    this._locMap.add(trackid, record.source.loc)
  }

  private _merge(from: TrackID, to: TrackID) {
    const merged = this._store.merge(from, to)

    merged.map((record) => {
      this._locMap.add(to, record.source.loc)
      this._locMap.remove(from, record.source.loc)
    })
  }

  private async _parseActionInfoIntoActionRecord(info: ActionInfo): Promise<ActionRecord> {
    const {
      fileName: scriptUrl,
      lineNumber,
      columnNumber
    } = this._filterStackTrace(info.stacktrace)

    return <ActionRecord>{
      type: ActionMap.filterActionType(info.target, info.action, info.actionTag),
      source: await this._fetchSource(scriptUrl, lineNumber, columnNumber)
    }
  }

  private _filterStackTrace(stacktrace: StackTrace.StackFrame[]): StackTrace.StackFrame {
    return stacktrace[this._HTML_DOM_API_FRAME_INDEX]
  }

  private async _fetchSource(scriptUrl: string, lineNumber: number, columnNumber: number): Promise<Source> {
    if (!this._scriptCache.has(scriptUrl)) {
      await this._fetchScriptSourceToCache(scriptUrl)
    }
    return <Source>{
      loc: `${scriptUrl}:${lineNumber}:${columnNumber}`,
      code: this._scriptCache.get(scriptUrl, lineNumber, columnNumber)
    }
  }

  private async _fetchScriptSourceToCache(scriptUrl: string): Promise<void> {
    const response = await fetch(scriptUrl)
    const scriptText = await response.text()

    this._scriptCache.add(scriptUrl, scriptText)
  }
}

class Store implements IStore {

  constructor() {
    this._ = {}
  }

  /* public */

  public add(trackid: TrackID, record: ActionRecord): void {
    if (!this._[trackid]) {
      this._[trackid] = []
    }
    this._[trackid].push(record)
  }

  public get(trackid: TrackID): ActionRecord[] {
    return this._[trackid]
  }

  public merge(from: TrackID, to: TrackID): ActionRecord[] {
    const merged: ActionRecord[] = this._[from] || []

    delete this._[from]

    if (merged.length > 0) {
      merged.map((record) => { this.add(to, record) })
    }
    return merged
  }

  /* private */

  private _: {
    [trackid in TrackID]: ActionRecord[]
  }
}

class LocMap implements ILocMap {

  constructor() {
    this._ = {}
  }

  /* public */

  public add(trackid: TrackID, loc: string): void {
    if (!this._[loc]) {
      this._[loc] = {}
    }
    this._[loc][trackid] = true
  }

  public has(trackid: TrackID, loc: string): boolean {
    return !!(this._[loc] && this._[loc][trackid])
  }

  public remove(trackid: TrackID, loc: string): void {
    this._[loc] && delete this._[loc][trackid]
  }

  /* private */

  private _: {
    [loc: string]: {
      [trackid in TrackID]: boolean;
    };
  }
}

class ScriptCache implements IScriptCache {

  constructor() {
    this._ = {}
  }

  /* public */

  public add(scriptUrl: string, scriptText: string): void {
    this._[scriptUrl] = scriptText.split('\n')
  }

  public get(scriptUrl: string, lineNumber: number, columnNumber: number): string {
    return this._[scriptUrl][lineNumber - 1]
  }

  public has(scriptUrl: string): boolean {
    return !!this._[scriptUrl]
  }

  /* private */

  private _: {
    [scriptUrl: string]: string[]
  }
}