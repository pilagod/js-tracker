/// <reference path='./ActionStore.d.ts'/>

import * as ESTree from '../../../node_modules/@types/estree'
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

import ActionMap from '../private/ActionMap'

export default class ActionStore implements IActionStore {

  /* public */

  public get(trackid: TrackID): ActionRecord[] {
    return this.store.get(trackid)
  }

  public async register(trackid: TrackID, record: ActionRecord): Promise<boolean> {
    if (!this.locMap.has(trackid, record.key)) {
      this.store.add(trackid, record)
      this.locMap.add(trackid, record.key)
      return true
    }
    return false
  }

  public async registerFromActionInfo(info: ActionInfo): Promise<boolean> {
    if (info.merge) {
      this.merge(info.merge, info.trackid)
    }
    const record: ActionRecord =
      await this.parseActionInfoIntoActionRecord(info)

    return await this.register(info.trackid, record)
  }

  /* private */

  private HTML_DOM_API_FRAME_INDEX = 2

  private store = new Store()
  private locMap = new LocMap()
  private scriptCache = new ScriptCache()

  private merge(from: TrackID, to: TrackID) {
    const merged = this.store.merge(from, to)

    merged.map((record) => {
      this.locMap.add(to, record.key)
      this.locMap.remove(from, record.key)
    })
  }

  private async parseActionInfoIntoActionRecord(info: ActionInfo): Promise<ActionRecord> {
    const {
      fileName: scriptUrl,
      lineNumber,
      columnNumber
    } = this.filterStackTrace(info.stacktrace)

    return <ActionRecord>{
      key: `${scriptUrl}:${lineNumber}:${columnNumber}`,
      type: ActionMap.getActionType(info.target, info.action, info.actionTag),
      source: <Source>{
        loc: { scriptUrl, lineNumber, columnNumber },
        code: await this.fetchSourceCode(scriptUrl, lineNumber, columnNumber)
      }
    }
  }

  private filterStackTrace(stacktrace: StackTrace.StackFrame[]): StackTrace.StackFrame {
    return stacktrace[this.HTML_DOM_API_FRAME_INDEX]
  }

  private async fetchSourceCode(scriptUrl: string, lineNumber: number, columnNumber: number): Promise<string> {
    if (!this.scriptCache.has(scriptUrl)) {
      this.scriptCache.add(scriptUrl, this.fetchScript(scriptUrl))
    }
    return await this.scriptCache.get(scriptUrl, lineNumber, columnNumber)
  }

  private async fetchScript(scriptUrl: string): Promise<ESTree.Node[]> {
    const script = this.trimSource(await (await fetch(scriptUrl)).text())
    const candidates = []

    esprima.parseScript(script, { loc: true }, (node) => {
      if (node.type === 'CallExpression' || node.type === 'AssignmentExpression') {
        candidates.push(node)
      }
    })
    return candidates
  }

  private trimSource(source: string): string {
    return this.isHTML(source) ? this.trimNonScriptPart(source) : source
  }

  private isHTML(source: string): boolean {
    return /<html[\s\S]*?>/.test(source)
  }

  private trimNonScriptPart(source: string): string {
    // @TODO: remote comments in style
    return ('/*' + source + '*/')
      // match only <script ...> and <script ... type="text/javascript" ...>
      .replace(/(<script(?:[\s\S](?:(?!type=)|(?=type="text\/javascript)))*?>)([\s\S]*?)(<\/script>)/gi, '$1*/$2/*$3')
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
    // @TODO: compress blockstatement
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