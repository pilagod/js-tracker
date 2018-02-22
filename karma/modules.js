var configFactory = require('./configFactory')

module.exports = configFactory(function (defaultConfig) {
  var customConfig = Object.assign({}, defaultConfig, {
    port: 9878,

    proxies: {
      '/script.js': `/base/test/script.js`,
      '/script.html': `/base/test/script.html`,
      '/script.min.html': `/base/test/script.min.html`
    },
    // list of files / patterns to load in the browser
    // all modules including in tests should be included here
    files: [
      /* targets */

      /* extension */
      { pattern: 'src/extension/private/ActionRecordStore.ts' },
      { pattern: 'src/extension/private/libs/*[!(.d)].ts' },

      /* tracker */
      { pattern: 'src/tracker/private/ActionMap.ts' },

      /* dependencies */
      { pattern: 'src/tracker/public/*[!(.d)].ts' },
      { pattern: 'src/tracker/private/*[!(.d)].ts' },

      /* static */
      { pattern: 'test/script.js', served: true, included: false },
      { pattern: 'test/script.html', served: true, included: false },
      { pattern: 'test/script.min.html', served: true, included: false },

      /* tests */
      { pattern: 'test/*.ts' },
      { pattern: 'test/extension/private/*.ts' },
      { pattern: 'test/tracker/private/*.ts' }
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      /* targets */

      /* extension */
      'src/extension/private/ActionRecordStore.ts': ['karma-typescript', 'coverage'],
      'src/extension/private/libs/*[!(.d)].ts': ['karma-typescript', 'coverage'],

      /* tracker */
      'src/tracker/private/ActionMap.ts': ['karma-typescript', 'coverage'],

      /* dependencies */
      'src/tracker/public/*[!(.d)].ts': ['karma-typescript'],
      'src/tracker/private/*[!(.d)].ts': ['karma-typescript'],

      /* tests */
      'test/*.ts': ['karma-typescript'],
      'test/extension/private/*.ts': ['karma-typescript'],
      'test/tracker/private/*.ts': ['karma-typescript']
    }
  })
  customConfig.karmaTypescriptConfig.reports.html = 'coverage/modules'

  return customConfig
})
