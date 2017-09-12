/// <reference path='./ActionStore.d.ts'/>

import * as ESTree from '../../../node_modules/@types/estree'
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

import ActionMap from '../private/ActionMap'

export default class ActionStore implements IActionStore {

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

  private _store = new Store()
  private _locMap = new LocMap()
  private _scriptCache = new ScriptCache()

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
      type: ActionMap.getActionType(info.target, info.action, info.actionTag),
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

  private async _fetchScript(scriptUrl: string): Promise<ESTree.Node[]> {
    const response = await fetch(scriptUrl)
    const script = await response.text()
    const candidates = []

    esprima.parseScript(script, { loc: true }, (node) => {
      if (node.type === 'CallExpression' || node.type === 'AssignmentExpression') {
        candidates.push(node)
      }
    })
    // @TODO: compress blockstatement
    return candidates
  }
}

class Store {

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

class LocMap {

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

class ScriptCache {

  constructor() {
    this.cache = {}
  }

  /* public */

  public add(scriptUrl: string, script: Promise<ESTree.Node[]>): void {
    this.cache[scriptUrl] = script
  }

  public async get(scriptUrl: string, lineNumber: number, columnNumber: number): Promise<string> {
    const candidates = await this.cache[scriptUrl]

    return escodegen.generate(
      this.elect(candidates, lineNumber, columnNumber),
      {
        format: {
          indent: { style: '' },
          newline: '',
          semicolons: false
        }
      }
    )
  }

  public has(scriptUrl: string): boolean {
    return this.cache.hasOwnProperty(scriptUrl)
  }

  /* private */

  private cache: {
    [scriptUrl: string]: Promise<ESTree.Node[]>
  }

  private elect(
    candidates: ESTree.Node[],
    lineNumber: number,
    columnNumber: number
  ): ESTree.Node {
    const action = {
      loc: {
        start: { line: lineNumber, column: columnNumber },
        end: { line: lineNumber, column: columnNumber }
      }
    }
    const elected = candidates
      .filter((candidate: ESTree.Node) => {
        return this.contains(candidate.loc, action.loc)
      })
      .reduce((elected: ESTree.Node, candidate: ESTree.Node, candidateIndex: number) => {
        if (this.contains(candidate.loc, action.loc)
          && this.contains(elected.loc, candidate.loc)
        ) {
          return candidate
        }
        return elected
      })
    // @TODO: should remove elected candidate
    return elected
  }

  private contains(loc1: ESTree.SourceLocation, loc2: ESTree.SourceLocation): boolean {
    return (
      (
        loc1.start.line < loc2.start.line ||
        (
          loc1.start.line === loc2.start.line &&
          loc1.start.column <= loc2.start.column
        )
      ) && (
        loc1.end.line > loc2.end.line ||
        (
          loc1.end.line === loc2.end.line &&
          loc1.end.column >= loc2.end.column
        )
      )
    )
  }
}