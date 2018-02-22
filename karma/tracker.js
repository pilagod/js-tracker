var configFactory = require('./configFactory')

module.exports = configFactory(function (defaultConfig) {
  var customConfig = Object.assign({}, defaultConfig, {
    port: 9877,

    proxies: {
      '/script.html': `/base/test/script.html`
    },
    // list of files / patterns to load in the browser
    // all modules including in tests should be included here
    files: [
      /* targets */
      { pattern: 'src/tracker/trackers/**/*[!(.d)].ts' },
      { pattern: 'src/tracker/private/*[!(.d)].ts' },

      /* dependencies */
      { pattern: 'src/tracker/public/*[!(.d)].ts' },

      /* static */
      { pattern: 'test/script.html', served: true, included: false },

      /* tests */
      { pattern: 'test/tracker/trackers/*.ts' }
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      /* targets */
      'src/tracker/trackers/**/*[!(.d)].ts': ['karma-typescript', 'coverage'],
      'src/tracker/private/*[!(.d)].ts': ['karma-typescript', 'coverage'],

      /* dependencies */
      'src/tracker/public/*[!(.d)].ts': ['karma-typescript'],

      /* tests */
      'test/tracker/trackers/*.ts': ['karma-typescript']
    }
  })
  customConfig.karmaTypescriptConfig.reports.html = 'coverage/tracker'

  return customConfig
})
