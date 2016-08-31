const importAllFrom = require('import-all-from')

describe('Attr', () => {
  importAllFrom(__dirname, {regexp: /^((?!index.js).)*$/})
})
