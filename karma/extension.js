var configFactory = require('./configFactory')

module.exports = configFactory(function (defaultConfig) {
  var customConfig = Object.assign({}, defaultConfig, {
    port: 9879,

    proxies: {
      '/script.js': `/base/test/script.js`
    },
    // list of files / patterns to load in the browser
    // all modules including in tests should be included here
    files: [
      /* targets */

      // contentscript
      { pattern: 'src/extension/contentscript.ts' },
      { pattern: 'src/extension/contentscriptHelpers.ts' },

      // devtool
      { pattern: 'src/extension/devtool.ts' },
      { pattern: 'src/extension/devtoolHelpers.ts' },

      // devtool sidebar
      { pattern: 'src/extension/Sidebar/*.tsx' },

      /* dependencies */
      { pattern: 'src/extension/utils.ts' },
      { pattern: 'src/extension/public/**/*[!(.d)].ts' },
      { pattern: 'src/extension/private/**/*[!(.d)].ts' },
      { pattern: 'src/tracker/public/**/*[!(.d)].ts' },

      /* tests */
      { pattern: 'test/*.ts' },
      { pattern: 'test/extension/*.ts' },
      { pattern: 'test/extension/Sidebar/*.ts' }
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      /* targets */

      // contentscript
      'src/extension/contentscript.ts': ['karma-typescript', 'coverage'],
      'src/extension/contentscriptHelpers.ts': ['karma-typescript', 'coverage'],

      // devtool
      'src/extension/devtool.ts': ['karma-typescript', 'coverage'],
      'src/extension/devtoolHelpers.ts': ['karma-typescript', 'coverage'],

      // devtool sidebar
      'src/extension/Sidebar/*.tsx': ['karma-typescript', 'coverage'],

      /* dependencies */
      'src/extension/utils.ts': ['karma-typescript'],
      'src/extension/public/**/*[!(.d)].ts': ['karma-typescript'],
      'src/extension/private/**/*[!(.d)].ts': ['karma-typescript'],
      'src/tracker/public/**/*[!(.d)].ts': ['karma-typescript'],

      /* tests */
      'test/*.ts': ['karma-typescript'],
      'test/extension/*.ts': ['karma-typescript'],
      'test/extension/Sidebar/*.ts': ['karma-typescript']
    }
  })
  customConfig.karmaTypescriptConfig.reports.html = 'coverage/extension'

  return customConfig
})
