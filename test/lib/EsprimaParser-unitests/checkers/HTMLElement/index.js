const importAllFrom = require('import-all-from')

describe('HTMLElement', () => {
  importAllFrom(__dirname, {regexp: /^((?!index.js).)*$/})
})
