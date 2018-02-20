import * as esprima from 'esprima'
import {
  ESTreeNodeSequentialFinder,
  ESTreeNodeBinaryFinder
} from '../../src/tracker/private/libs/ESTreeNodeFinder'

describe('benchmark of ESTreeNodeFinder', function () {
  this.timeout(10000)

  function initializeESTreeNodes(sets) {
    let script = ''
    for (let i = 0; i < sets; i++) {
      script += 'div.addEventListener(\'click\', function () {\n    div.style.color = \'red\'\n})\n'
    }
    const nodes = []
    esprima.parseScript(script, { loc: true }, (node) => {
      nodes.push(node)
    })
    return nodes
  }

  it('sequential v.s. binary', () => {
    const sets = 2000
    const nodes = initializeESTreeNodes(sets)
    const sequentialFinder = new ESTreeNodeSequentialFinder()
    const binaryFinder = new ESTreeNodeBinaryFinder()

    let start

    // for sequential
    start = Date.now()
    for (let i = 1; i <= sets * 3; i += 3) {
      sequentialFinder.find(nodes, i, 4)
    }
    const sequential = Date.now() - start

    // for binary
    start = Date.now()
    for (let i = 1; i <= sets * 3; i += 3) {
      binaryFinder.find(nodes, i, 4)
    }
    const binary = Date.now() - start

    console.log('----- average binary / sequential -----')
    console.log('sequential: ' + sequential / 1000 + ' secs')
    console.log('binary: ' + binary / 1000 + ' secs')
    console.log('binary / sequntial: ', binary / sequential)
    console.log('---------------------------------------')
  })
})