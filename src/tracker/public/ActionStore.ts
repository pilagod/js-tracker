/// <reference path='./ActionStore.d.ts'/>

import * as ESTree from '../../../node_modules/@types/estree'
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

import { hash } from './utils'

export default class ActionStore implements IActionStore {
  private store = new Store()
  private recordPool = new RecordPool()
  private scriptCache = new ScriptCache()

  /* public */

  public get(trackid: TrackID): ActionRecord[] {
    return this.store.get(trackid)
  }

  public async registerFromActionInfo(info: ActionInfo): Promise<boolean> {
    await this.updateRecordPool(info)
    // @TODO: check recordPool.refs contains info.trackid
    return this.updateStore(info)
  }

  /* private */

  private async updateRecordPool(info: ActionInfo) {
    if (!this.recordPool.has(info)) {
      this.recordPool.add(info, await this.fetchCode(info.loc))
    }
  }

  private async fetchCode({ scriptUrl, lineNumber, columnNumber }: SourceLocation): Promise<string> {
    if (!this.scriptCache.has(scriptUrl)) {
      this.scriptCache.add(scriptUrl)
    }
    return await this.scriptCache.get(scriptUrl, lineNumber, columnNumber)
  }

  private updateStore(info: ActionInfo): boolean {
    if (!this.store.contains(info.trackid, this.recordPool.get(info))) {
      if (info.merge) {
        this.store.merge(info.merge, info.trackid)
      }
      this.store.add(info.trackid, this.recordPool.get(info))
      return true
    }
    return false
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

  public contains(trackid: TrackID, record: ActionRecord): boolean {
    return this.store.hasOwnProperty(trackid)
      && this.store[trackid].filter((_record) => _record.key === record.key).length > 0
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

class RecordPool {

  private pool: {
    [hashOfSourceLocation: string]: ActionRecord
  } = {};

  /* public */

  public add({ type, loc }: ActionInfo, code: string): ActionRecord {
    const key = this.hashSourceLocation(loc)

    return this.pool[key] = { key, type, source: { loc, code } }
  }

  public get({ loc }: ActionInfo): ActionRecord {
    return this.pool[this.hashSourceLocation(loc)]
  }

  public has({ loc }: ActionInfo): boolean {
    return this.pool.hasOwnProperty(this.hashSourceLocation(loc))
  }

  /* private */

  private hashSourceLocation({ scriptUrl, lineNumber, columnNumber }: SourceLocation): string {
    return hash(`${scriptUrl}:${lineNumber}:${columnNumber}`)
  }
}

class ScriptCache {

  private cache: {
    [scriptUrl: string]: Promise<ESTree.Node[]>
  } = {}

  /* public */

  public add(scriptUrl: string): void {
    this.cache[scriptUrl] =
      this.parseScriptIntoCandidateESTNodes(
        this.fetchScript(scriptUrl)
      )
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

  private async fetchScript(scriptUrl: string): Promise<string> {
    const source = await (await fetch(scriptUrl)).text()

    return this.isHTML(source) ? this.commentHTMLTags(source) : source
  }

  private isHTML(source: string): boolean {
    return /<html[\s\S]*?>/.test(source)
  }

  private commentHTMLTags(source: string): string {
    // @NOTE: commenting out html tags instead of removing is
    // because removing html part will cause code location
    // (line and column) to change, and this will bring 
    // inconsistency of code location between stack trace and 
    // source code we fetched here.
    return ('/*' + this.removeCommentsInStyleBlocks(source) + '*/')
      // match only <script ...> and <script ... type="text/javascript" ...>
      .replace(/(<script(?:[\s\S](?:(?!type=)|(?=type="text\/javascript)))*?>)([\s\S]*?)(<\/script>)/gi, '$1*/$2/*$3')
  }

  private removeCommentsInStyleBlocks(source: string) {
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

  private async parseScriptIntoCandidateESTNodes(script: Promise<string>): Promise<ESTree.Node[]> {
    const candidates = []

    esprima.parseScript(await script, { loc: true }, (node) => {
      if (node.type === 'CallExpression' || node.type === 'AssignmentExpression') {
        candidates.push(node)
      }
    })
    return candidates
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
    const elected =
      candidates
        .filter((candidate: ESTree.Node) => {
          return this.contains(candidate.loc, action.loc)
        })
        .reduce((elected: ESTree.Node, candidate: ESTree.Node) => {
          return this.contains(elected.loc, candidate.loc) ? candidate : elected
        })
    // remove elected candidate
    candidates.splice(candidates.indexOf(elected), 1)
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