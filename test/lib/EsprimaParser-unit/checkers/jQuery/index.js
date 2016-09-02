const importAllFrom = require('import-all-from')

describe('jQuery', () => {
  importAllFrom(__dirname, {regexp: /^((?!index.js).)*$/})
})
