var config = require('./config')
var configFactory = require('./configFactory')

module.exports = configFactory(Object.assign({}, config, {
  files: [
    /* targets */
    { pattern: 'src/tracker/*[!(.d)].ts' },
    { pattern: 'src/tracker/private/*[!(.d)].ts' },

    /* dependencies */
    { pattern: 'src/tracker/public/*[!(.d)].ts' },

    /* tests */
    { pattern: 'test/tracker/*.ts' }
  ],
  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    /* targets */
    'src/tracker/*[!(.d)].ts': ['karma-typescript', 'coverage'],
    'src/tracker/private/*[!(.d)].ts': ['karma-typescript', 'coverage'],

    /* dependencies */
    'src/tracker/public/*[!(.d)].ts': ['karma-typescript'],

    /* tests */
    'test/tracker/*.ts': ['karma-typescript']
  }
}))
