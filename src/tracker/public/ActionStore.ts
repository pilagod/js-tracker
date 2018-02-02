/// <reference path='../types/ActionStore.d.ts'/>

import * as ESTree from '../../../node_modules/@types/estree'
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

import { hashSourceLocation } from './utils'

export default class ActionStore implements IActionStore {

  private store = new Store()
  private scriptProcessor = new ScriptProcessor()

  /* public */

  public get(trackid: TrackID): ActionRecord[] {
    return this.store.get(trackid)
  }

  public async registerFromActionInfo(info: ActionInfo): Promise<boolean> {
    const { trackid, type, loc, merge } = info
    const key = hashSourceLocation(loc)

    if (this.store.contains(trackid, key)) {
      return false
    }
    // @NOTE: same call/assignment might execute multiple times in short period, 
    // before any code fetched, these actions will send duplicate requests to
    // fetch the same code segment. To fix this, we use record with default value 
    // on its not yet fetched code property, in order to occupy the position in 
    // record pool in advance, avoiding upcoming same actions to do duplicate requests. 
    const record = { key, type, loc, code: 'loading...' }

    if (merge) {
      this.store.merge(merge, trackid)
    }
    this.store.add(trackid, record)
    record.code = await this.fetchCode(key, loc)
    return true
  }

  /* private */

  private async fetchCode(key: string, loc: SourceLocation): Promise<string> {
    if (!this.scriptProcessor.has(loc.scriptUrl)) {
      this.scriptProcessor.add(loc.scriptUrl)
    }
    return await this.scriptProcessor.get(key, loc)
  }
}

class Store {

  private store: {
    [trackid in TrackID]: ActionRecord[]
  } = {}

  /* public */

  public add(trackid: TrackID, record: ActionRecord): boolean {
    if (!this.store[trackid]) {
      this.store[trackid] = []
    }
    this.store[trackid].unshift(record)
    return true
  }

  public get(trackid: TrackID): ActionRecord[] {
    return this.store[trackid] || []
  }

  public contains(trackid: TrackID, key: string): boolean {
    return this.store.hasOwnProperty(trackid) && this.store[trackid].some((record) => record.key === key)
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

// class ActionRecordPool {
//   static LOADING = 'loading...'

//   private scriptCache = new ScriptCache()
//   private pool: {
//     [hashOfSourceLocation: string]: ActionRecord
//   } = {};

//   /* public */
//   // @TODO: await here
//   public async update(info: ActionInfo): Promise<ActionRecord> {
//     const key = hashActionInfo(info)

//     // @TODO: add type to key ?
//     if (!this.pool.hasOwnProperty(key)) {
//       // @NOTE: same call/assignment might execute multiple times in short period, 
//       // before any code fetched, these actions will send duplicate requests to
//       // fetch the same code segment. To fix this, we use record with default value 
//       // on its not yet fetched code property, in order to occupy the position in 
//       // record pool in advance, avoiding upcoming same actions to do duplicate requests. 
//       this.pool[key] = { key, type, loc, code: SourcePool.LOADING }
//       this.pool[key].code = await this.fetchCode(loc)
//     }
//     return this.pool[key]
//   }

//   /* private */

//   private async fetchCode({ scriptUrl, lineNumber, columnNumber }: SourceLocation): Promise<string> {
//     if (!this.scriptCache.has(scriptUrl)) {
//       this.scriptCache.add(scriptUrl)
//     }
//     return await this.scriptCache.get(scriptUrl, lineNumber, columnNumber)
//   }
// }

class ScriptProcessor {

  private cache: {
    [scriptUrl: string]: Promise<ESTree.Node[]>
  } = {}
  private code: {
    [key: string]: Promise<string>
  } = {}

  /* public */

  public add(scriptUrl: string): void {
    this.cache[scriptUrl] = this.parseScriptIntoCandidateESTNodes(scriptUrl)
  }

  public async get(key: string, loc: SourceLocation): Promise<string> {
    if (!this.code.hasOwnProperty(key)) {
      this.code[key] = this.fetchCode(loc)
    }
    return await this.code[key]
  }

  public has(scriptUrl: string): boolean {
    return this.cache.hasOwnProperty(scriptUrl)
  }

  /* private */

  private async parseScriptIntoCandidateESTNodes(scriptUrl: string): Promise<ESTree.Node[]> {
    const script = await this.fetchScript(scriptUrl)
    const candidates = []

    esprima.parseScript(script, { loc: true }, (node) => {
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

  private async fetchScript(scriptUrl: string): Promise<string> {
    const source = await (await fetch(scriptUrl)).text()

    return this.isHTML(source) ? this.handleHTMLTags(source) : source
  }

  private isHTML(source: string): boolean {
    // @NOTE: http://www.flycan.com/article/css/html-doctype-97.html
    return /^(<!DOCTYPE HTML[\s\S]*?>[\s]*)??<html[\s\S]*?>/i.test(source)
  }

  private handleHTMLTags(source: string): string {
    const trimmedSource = [
      this.trimComments,
      this.trimHtmlTags
    ].reduce((source, trimmer) => trimmer(source), source)
    // @NOTE: add open/close comments around whole html source,
    // use slice to avoid code shifting in final parsed source
    return `/*${trimmedSource.slice(2, -2)}*/`
  }

  private trimComments = (source: string) => {
    const rangeOfBlockComments = this.indexRangeOfBlockComments(source)
    const rangeOfValidScripts = this.indexRangeOfValidScripts(source)
    const rangeOfBlockCommentsNotInScript = rangeOfBlockComments.filter(([commentStart, commentEnd]) => {
      return !rangeOfValidScripts.reduce((result, [scriptStart, scriptEnd]) => {
        return result || (commentStart >= scriptStart && commentEnd <= scriptEnd)
      }, false)
    })
    return rangeOfBlockCommentsNotInScript.reduce((source, [commentStart, commentEnd]) => {
      // change /* ... */ to ** ... **
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

  private trimHtmlTags = (source: string) => {
    // @NOTE: commenting out html tags instead of removing is
    // because removing html part will cause code location
    // (line and column) to change, and this will bring 
    // inconsistency of code location between stack trace and 
    // source code we fetched here.
    return source.replace(/(<script(?:[\s\S](?:(?!type=)|(?=type=['"]text\/javascript['"])))*?>)([\s\S]*?)(<\/script>)/gi, (_, p1, p2, p3) => {
      // @NOTE: for those minified (a.k.a one line) html, directly change 
      // <script> ... </script> to <script>*/ ... /*</script> will cause 
      // the parsed source to shift the count of characters of new added comments 
      return `${p1.slice(0, -2)}*/${p2}/*${p3.slice(2)}`
    })
  }

  private async fetchCode({ scriptUrl, lineNumber, columnNumber }: SourceLocation) {
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