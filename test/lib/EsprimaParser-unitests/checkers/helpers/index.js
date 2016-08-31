const importAllFrom = require('import-all-from')

describe('helpers', () => {
  before(() => {
    global.Callee = require(`../${libDir}/structures/Callee`)
    global.Collection = require(`../${libDir}/structures/Collection`)
  })

  after(() => {
    delete global.Callee
    delete global.Collection
  })

  importAllFrom(__dirname, {regexp: /^((?!index.js).)*$/})
})
