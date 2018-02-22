import * as ESTree from '../../../../node_modules/@types/estree'
import { ESTreeNodeFinder } from '../ActionRecordStore'

abstract class BasicESTreeNodeFinder implements ESTreeNodeFinder {

  /* abstract */

  public abstract find(nodes: ESTree.Node[], line: number, column: number): ESTree.Node

  /* protected */

  protected contains(loc1: ESTree.SourceLocation, loc2: ESTree.SourceLocation): boolean {
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

export class ESTreeNodeSequentialFinder extends BasicESTreeNodeFinder {

  /* public */

  public find(nodes: ESTree.Node[], line: number, column: number): ESTree.Node {
    return this.sequentialSearch(nodes, {
      start: { line, column },
      end: { line, column }
    })
  }

  /* private */

  private sequentialSearch(nodes: ESTree.Node[], source: ESTree.SourceLocation): ESTree.Node {
    return nodes.filter((candidate: ESTree.Node) => {
      return this.contains(candidate.loc, source)
    }).reduce((elected: ESTree.Node, candidate: ESTree.Node) => {
      return this.contains(elected.loc, candidate.loc) ? candidate : elected
    })
  }
}

export class ESTreeNodeBinaryFinder extends BasicESTreeNodeFinder {

  /* public */

  public find(nodes: ESTree.Node[], line: number, column: number): ESTree.Node {
    return this.binarySearch(nodes, 0, nodes.length - 1, {
      start: { line, column },
      end: { line, column },
    })
  }

  /* private */

  private binarySearch(
    nodes: ESTree.Node[],
    left: number,
    right: number,
    source: ESTree.SourceLocation
  ): ESTree.Node {
    if (left > right) {
      return null
    }
    const mid = Math.floor((left + right) / 2)

    if (this.contains(nodes[mid].loc, source)) {
      const node = this.binarySearch(nodes, left, mid - 1, source)
      return node ? node : nodes[mid]
    } else if (this.precedes(nodes[mid].loc, source)) {
      return this.binarySearch(nodes, mid + 1, right, source)
    } else {
      const node = this.binarySearch(nodes, left, mid - 1, source)
      return node ? node : this.binarySearch(nodes, mid + 1, right, source)
    }
  }

  private precedes(loc1: ESTree.SourceLocation, loc2: ESTree.SourceLocation): boolean {
    return (
      loc1.end.line < loc2.start.line ||
      (
        loc1.end.line === loc2.start.line &&
        loc1.end.column < loc2.start.column
      )
    )
  }
}