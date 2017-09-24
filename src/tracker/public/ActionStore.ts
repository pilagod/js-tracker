/// <reference path='./ActionStore.d.ts'/>

import * as ESTree from '../../../node_modules/@types/estree'
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

import ActionMap from '../private/ActionMap'

export default class ActionStore implements IActionStore {
  private store = new Store()
  private locMap = new LocMap()
  private scriptCache = new ScriptCache()

  /* public */

  public get(trackid: TrackID): ActionRecord[] {
    return this.store.get(trackid)
  }

  public async registerFromActionInfo(info: ActionInfo): Promise<boolean> {
    if (info.merge) {
      this.merge(info.merge, info.trackid)
    }
    const record: ActionRecord =
      await this.parseActionInfoIntoActionRecord(info)

    return this.locMap.has(info.trackid, record.key)
      ? false
      : this.register(info.trackid, record)
  }

  /* private */

  private register(trackid: TrackID, record: ActionRecord): boolean {
    this.store.add(trackid, record)
    this.locMap.add(trackid, record.key)

    return true
  }

  private merge(from: TrackID, to: TrackID) {
    const merged = this.store.merge(from, to)

    merged.map((record) => {
      this.locMap.add(to, record.key)
      this.locMap.remove(from, record.key)
    })
  }

  private async parseActionInfoIntoActionRecord(info: ActionInfo): Promise<ActionRecord> {
    return <ActionRecord>{
      key: `${info.loc.scriptUrl}:${info.loc.lineNumber}:${info.loc.columnNumber}`,
      type: ActionMap.getActionType(info.target, info.action, info.actionTag),
      source: <Source>{
        loc: info.loc,
        code: await this.fetchSourceCode(info.loc.scriptUrl, info.loc.lineNumber, info.loc.columnNumber)
      }
    }
  }

  private async fetchSourceCode(scriptUrl: string, lineNumber: number, columnNumber: number): Promise<string> {
    if (!this.scriptCache.has(scriptUrl)) {
      this.scriptCache.add(scriptUrl, this.fetchScript(scriptUrl))
    }
    return await this.scriptCache.get(scriptUrl, lineNumber, columnNumber)
  }

  private async fetchScript(scriptUrl: string): Promise<ESTree.Node[]> {
    const script = this.process(await (await fetch(scriptUrl)).text())
    const candidates = []

    esprima.parseScript(script, { loc: true }, (node) => {
      if (node.type === 'CallExpression' || node.type === 'AssignmentExpression') {
        candidates.push(node)
      }
    })
    return candidates
  }

  private process(source: string): string {
    return this.isHTML(source) ? this.commentOutNonScriptPart(source) : source
  }

  private isHTML(source: string): boolean {
    return /<html[\s\S]*?>/.test(source)
  }

  private commentOutNonScriptPart(source: string): string {
    // @NOTE: commenting out html tags but not removing is
    // because removing html part will cause code location
    // (line and column) to change, and this will bring 
    // inconsistency of code location to call stack and 
    // source code we fetched here.
    return ('/*' + this.removeCommentsInStyleTags(source) + '*/')
      // match only <script ...> and <script ... type="text/javascript" ...>
      .replace(/(<script(?:[\s\S](?:(?!type=)|(?=type="text\/javascript)))*?>)([\s\S]*?)(<\/script>)/gi, '$1*/$2/*$3')
  }

  private removeCommentsInStyleTags(source: string) {
    // @NOTE: comments in style block will break off 
    // those comment blocks added to other html part
    return this.indexStyleRanges(source).reduce((result, [start, end]) => {
      for (let i = start; i < end; i++) {
        if (source[i] === '/' && (source[i + 1] === '*' || source[i - 1] === '*')) {
          result = result.slice(0, i) + '*' + result.slice(i + 1)
        }
      }
      return result
    }, source)
  }

  private indexStyleRanges(source: string): Array<[number, number]> {
    const result = []
    const endOffset = '</style>'.length

    let [start, end] = [
      source.indexOf('<style', 0),
      source.indexOf('</style>', 0) + endOffset
    ]
    while (start !== -1) {
      result.push([start, end]);
      [start, end] = [
        source.indexOf('<style', end),
        source.indexOf('</style>', end) + endOffset
      ]
    }
    return result
  }
}

class Store {

  private store: {
    [trackid in TrackID]: ActionRecord[]
  } = {}

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
}

class LocMap {

  private locMap: {
    [loc: string]: {
      [trackid in TrackID]: boolean;
    };
  } = {}

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
}

class ScriptCache {

  private cache: {
    [scriptUrl: string]: Promise<ESTree.Node[]>
  } = {}

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