/// <reference path='../types/ActionStore.d.ts'/>

import * as ESTree from '../../../node_modules/@types/estree'
import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

import { ESTreeNodeBinaryFinder } from '../private/libs/ESTreeNodeFinder'
import { hashSourceLocation } from './utils'

export default class ActionStore implements IActionStore {

  private fetcher = new CodeFetcher()
  private store = new RecordStore()

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
    record.code = await this.fetcher.fetchCodeFrom(loc)
    return true
  }
}

class RecordStore {

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

class CodeFetcher {

  private parser = new ScriptParser()
  private code: {
    [hashOfSourceLocation: string]: Promise<string>
  } = {}

  public async fetchCodeFrom(loc: SourceLocation): Promise<string> {
    const key = hashSourceLocation(loc)

    if (!this.code.hasOwnProperty(key)) {
      this.code[key] = this.fetchCodeFromSourceLocation(loc)
    }
    return await this.code[key]
  }

  private async fetchCodeFromSourceLocation(loc: SourceLocation): Promise<string> {
    if (!this.parser.hasParsed(loc.scriptUrl)) {
      this.parser.parse(loc.scriptUrl)
    }
    return this.fetchCodeFromESTreeNode(await this.parser.findNode(loc))
  }

  private fetchCodeFromESTreeNode(node: ESTree.Node): string {
    return escodegen.generate(node, {
      format: {
        indent: { style: '' },
        newline: '',
        semicolons: false
      }
    }).replace(/{}/, '{ ... }')
  }
}

export interface ESTreeNodeFinder {
  find(nodes: ESTree.Node[], line: number, column: number): ESTree.Node
}

class ScriptParser {

  private finder: ESTreeNodeFinder = new ESTreeNodeBinaryFinder()
  private nodes: {
    [scriptUrl: string]: Promise<ESTree.Node[]>
  } = {}

  /* public */

  public async findNode(loc: SourceLocation): Promise<ESTree.Node> {
    // @TODO: remove subset node of elected one 
    // @NOTE: There is 1 offset of column between stacktrace and esprima
    // stacktrace counts column from 1, while esprima counts column from 0
    return this.finder.find(
      await this.nodes[loc.scriptUrl],
      loc.lineNumber,
      loc.columnNumber - 1
    )
  }

  public hasParsed(scriptUrl: string): boolean {
    return this.nodes.hasOwnProperty(scriptUrl)
  }

  public parse(scriptUrl: string): void {
    this.nodes[scriptUrl] =
      this.parseScriptIntoCandidateESTreeNodes(scriptUrl)
  }

  /* private */

  private async parseScriptIntoCandidateESTreeNodes(scriptUrl: string): Promise<ESTree.Node[]> {
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
    // @NOTE: not sure if every html page is start from <!DOCTYPE>
    return /^([\s]*?<!DOCTYPE HTML[\s\S]*?>[\s]*)??<html[\s\S]*?>/i.test(source)
  }

  private handleHTMLTags(source: string): string {
    return [
      this.trimComments,
      this.trimHtmlTags,
      this.trimOpenCloseTags,
      this.trimSpecialCharacters
    ].reduce((source, trimmer) => trimmer(source), source)
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
      return `${p1.slice(0, -2)}*/${p2};/*${p3.slice(3)}`
    })
  }

  private trimOpenCloseTags = (source) => {
    // @NOTE: add open/close comments around whole html source,
    // use replace to avoid code location shifting in trimmed source
    // @NOTE: since there might be newline before and after source, 
    // we only try to replace first and last two occurences of character
    return source
      .replace(/^([\s]*?)([\S]{2})/i, '$1/*') // replace first two occurence of character 
      .replace(/([\S]{2})([\s]*?)$/i, '*/$2') // replace last two occurences of character
  }

  private trimSpecialCharacters(source) {
    // @NOTE: [http://www.cnblogs.com/rrooyy/p/5349978.html]
    // @NOTE: [https://github.com/decaffeinate/decaffeinate/commit/e1322ab2f276c786c57d6bb205b42f2090081a06]
    // @NOTE: [https://stackoverflow.com/questions/2965293/javascript-parse-error-on-u2028-unicode-character]
    // @NOTE: \u2029 and \u2029 will be treated as newline in esprima parser,
    // location generate from stacktrace doesn't take it as a character,
    // so we directly replace it with empty string
    return source.replace(/[\u2028\u2029]/g, '')
  }
}