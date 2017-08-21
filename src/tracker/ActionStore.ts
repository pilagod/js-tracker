/// <reference path='./ActionStore.d.ts'/>
/// <reference path='./MessageType.d.ts'/>

import ActionMap from './private/ActionMap'
import MessageType from './MessageType'

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

  public async register(trackid: TrackID, record: ActionRecord): Promise<boolean> {
    if (!this._locMap.has(trackid, record.key)) {
      this._register(trackid, record)
      return true
    }
    return false
  }

  public async registerFromActionInfo(info: ActionInfo): Promise<boolean> {
    if (info.merge) {
      this._merge(info.merge, info.trackid)
    }
    const record: ActionRecord =
      await this._parseActionInfoIntoActionRecord(info)

    return await this.register(info.trackid, record)
  }

  /* private */

  private _HTML_DOM_API_FRAME_INDEX = 2

  private _store: IStore
  private _locMap: ILocMap
  private _scriptCache: IScriptCache

  private _register(trackid: TrackID, record: ActionRecord): void {
    this._store.add(trackid, record)
    this._locMap.add(trackid, record.key)
  }

  private _merge(from: TrackID, to: TrackID) {
    const merged = this._store.merge(from, to)

    merged.map((record) => {
      this._locMap.add(to, record.key)
      this._locMap.remove(from, record.key)
    })
  }

  private async _parseActionInfoIntoActionRecord(info: ActionInfo): Promise<ActionRecord> {
    const {
      fileName: scriptUrl,
      lineNumber,
      columnNumber
    } = this._filterStackTrace(info.stacktrace)

    return <ActionRecord>{
      key: `${scriptUrl}:${lineNumber}:${columnNumber}`,
      type: ActionMap.filterActionType(info.target, info.action, info.actionTag),
      source: <Source>{
        loc: { scriptUrl, lineNumber, columnNumber },
        code: await this._fetchSourceCode(scriptUrl, lineNumber, columnNumber)
      }
    }
  }

  private _filterStackTrace(stacktrace: StackTrace.StackFrame[]): StackTrace.StackFrame {
    return stacktrace[this._HTML_DOM_API_FRAME_INDEX]
  }

  private async _fetchSourceCode(scriptUrl: string, lineNumber: number, columnNumber: number): Promise<string> {
    if (!this._scriptCache.has(scriptUrl)) {
      this._scriptCache.add(scriptUrl, this._fetchScript(scriptUrl))
    }
    return await this._scriptCache.get(scriptUrl, lineNumber, columnNumber)
  }

  private async _fetchScript(scriptUrl: string): Promise<string[]> {
    const response = await fetch(scriptUrl)
    const scriptText = await response.text()

    return scriptText.split('\n').map((line) => {
      return line.trim()
    })
  }
}

class Store implements IStore {

  constructor() {
    this.store = {}
  }

  /* public */

  public add(trackid: TrackID, record: ActionRecord): void {
    if (!this.store[trackid]) {
      this.store[trackid] = []
    }
    this.store[trackid].unshift(record)
  }

  public get(trackid: TrackID): ActionRecord[] {
    return this.store[trackid] || []
  }

  public merge(from: TrackID, to: TrackID): ActionRecord[] {
    const merged: ActionRecord[] = this.get(from)

    delete this.store[from]

    if (merged.length > 0) {
      merged.map((record) => { this.add(to, record) })
    }
    return merged
  }

  /* private */

  private store: {
    [trackid in TrackID]: ActionRecord[]
  }
}

class LocMap implements ILocMap {

  constructor() {
    this.locMap = {}
  }

  /* public */

  public add(trackid: TrackID, loc: string): void {
    if (!this.locMap[loc]) {
      this.locMap[loc] = {}
    }
    this.locMap[loc][trackid] = true
  }

  public has(trackid: TrackID, loc: string): boolean {
    return !!(this.locMap[loc] && this.locMap[loc][trackid])
  }

  public remove(trackid: TrackID, loc: string): void {
    this.locMap[loc] && delete this.locMap[loc][trackid]
  }

  /* private */

  private locMap: {
    [loc: string]: {
      [trackid in TrackID]: boolean;
    };
  }
}

class ScriptCache implements IScriptCache {

  constructor() {
    this.cache = {}
  }

  /* public */

  public add(scriptUrl: string, scriptPromise: Promise<string[]>): void {
    this.cache[scriptUrl] = scriptPromise
  }

  public async get(scriptUrl: string, lineNumber: number, columnNumber: number): Promise<string> {
    // @TODO: take column into account
    // @TODO: trim just one line with maximum 50 letters
    return (await this.cache[scriptUrl])[lineNumber - 1]
  }

  public has(scriptUrl: string): boolean {
    return this.cache.hasOwnProperty(scriptUrl)
  }

  /* private */

  private cache: {
    [scriptUrl: string]: Promise<string[]>
  }
}