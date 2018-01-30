/// <reference path='../types/ActionStore.d.ts'/>

import * as ESTree from '../../../node_modules/@types/estree'
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

import { hash } from './utils'

export default class ActionStore implements IActionStore {

  private store = new Store()
  private recordPool = new RecordPool()

  /* public */

  public get(trackid: TrackID): ActionRecord[] {
    return this.store.get(trackid)
  }

  public async registerFromActionInfo(info: ActionInfo): Promise<boolean> {
    return this.updateStore(info, await this.recordPool.update(info))
  }

  /* private */

  private updateStore({ trackid, merge }: ActionInfo, record: ActionRecord): boolean {
    return !this.store.contains(trackid, record) && !(() => {
      merge && this.store.merge(merge, trackid)
      this.store.add(trackid, record)
    })()
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

  public contains(trackid: TrackID, record: ActionRecord): boolean {
    return this.store.hasOwnProperty(trackid) && this.store[trackid].indexOf(record) > -1
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

  private scriptCache = new ScriptCache()
  private pool: {
    [hashOfSourceLocation: string]: ActionRecord
  } = {};

  /* public */

  public async update({ type, loc }: ActionInfo): Promise<ActionRecord> {
    const key =
      hash(`${loc.scriptUrl}:${loc.lineNumber}:${loc.columnNumber}`)

    if (!this.pool.hasOwnProperty(key)) {
      // @NOTE: same call/assignment might execute multiple times in short period, 
      // before any code fetched, these actions will send duplicate requests to
      // fetch the same code segment. To fix this, we use record with default value 
      // on its not yet fetched code property, in order to occupy the position in 
      // record pool in advance, avoiding upcoming same actions to do duplicate requests. 
      this.pool[key] = { key, type, loc, code: 'loading...' }
      this.pool[key].code = await this.fetchCode(loc)
    }
    return this.pool[key]

  }

  /* private */

  private async fetchCode({ scriptUrl, lineNumber, columnNumber }: SourceLocation): Promise<string> {
    if (!this.scriptCache.has(scriptUrl)) {
      this.scriptCache.add(scriptUrl)
    }
    return await this.scriptCache.get(scriptUrl, lineNumber, columnNumber)
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
    ).replace(/{}/, '{ ... }')
  }

  public has(scriptUrl: string): boolean {
    return this.cache.hasOwnProperty(scriptUrl)
  }

  /* private */

  private async fetchScript(scriptUrl: string): Promise<string> {
    const source = await (await fetch(scriptUrl)).text()

    return this.isHTML(source) ? this.refineHTMLTags(source) : source
  }
  private isHTML(source: string): boolean {
    // @NOTE: http://www.flycan.com/article/css/html-doctype-97.html
    return /^(<!DOCTYPE HTML[\s\S]*?>[\s]*)??<html[\s\S]*?>/i.test(source)
  }

  private refineHTMLTags(source: string): string {
    // @NOTE: commenting out html tags instead of removing is
    // because removing html part will cause code location
    // (line and column) to change, and this will bring 
    // inconsistency of code location between stack trace and 
    // source code we fetched here.
    return ('/*' + this.refineComments(source) + '*/')
      // match only <script ...> and <script ... type="text/javascript" ...>
      .replace(/(<script(?:[\s\S](?:(?!type=)|(?=type=['"]text\/javascript['"])))*?>)([\s\S]*?)(<\/script>)/gi, (_, p1, p2, p3) => {
        // @NOTE: for those minified (a.k.a one line) html, directly change 
        // <script> ... </script> to <script>*/ ... /*</script> will cause 
        // the parsed code to shift count of characters of new added comments 
        return `${p1.slice(0, -2)}*/${p2}/*${p3.slice(2)}`
      })
  }

  private refineComments(source: string) {
    const rangeOfBlockComments = this.indexRangeOfBlockComments(source)
    const rangeOfValidScripts = this.indexRangeOfValidScripts(source)
    const rangeOfBlockCommentsNotInScript = rangeOfBlockComments.filter(([commentStart, commentEnd]) => {
      return !rangeOfValidScripts.reduce((result, [scriptStart, scriptEnd]) => {
        return result || (commentStart >= scriptStart && commentEnd <= scriptEnd)
      }, false)
    })
    return rangeOfBlockCommentsNotInScript.reduce((source, [commentStart, commentEnd]) => {
      // refine /* ... */ to ** ... **
      return source.slice(0, commentStart) + '*' + source.slice(commentStart + 1, commentEnd) + '*' + source.slice(commentEnd + 1)
    }, source)
  }

  private indexRangeOfBlockComments(source: string): [number, number][] {
    return this.indexRangeOf(source, /\/\*[\s\S]*?\*\//gi)
  }

  private indexRangeOfValidScripts(source: string): [number, number][] {
    return this.indexRangeOf(source, /<script([\s\S]((?!type=)|(?=type=['"]text\/javascript['"])))*?>[\s\S]*?<\/script>/gi)
  }

  private indexRangeOf(source: string, regexp: RegExp): [number, number][] {
    const result = []

    let match

    while (match = regexp.exec(source)) {
      result.push([match.index, regexp.lastIndex - 1])
    }
    return result
  }

  private async parseScriptIntoCandidateESTNodes(script: Promise<string>): Promise<ESTree.Node[]> {
    const candidates = []

    esprima.parseScript(await script, { loc: true }, (node) => {
      switch (node.type) {
        case 'AssignmentExpression':
        case 'CallExpression':
          candidates.push(node)
          break
        case 'BlockStatement':
          node.body = [] // ignore unimportant details
          break
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