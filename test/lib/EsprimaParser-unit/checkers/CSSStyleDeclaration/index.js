const importAllFrom = require('import-all-from')

describe('CSSStyleDeclaration', () => {
  importAllFrom(__dirname, {regexp: /^((?!index.js).)*$/})
})
