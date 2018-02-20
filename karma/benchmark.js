var configFactory = require('./configFactory')

module.exports = configFactory(function (defaultConfig) {
  var customConfig = Object.assign({}, defaultConfig, {
    port: 9999,

    // list of files / patterns to load in the browser
    // all modules including in tests should be included here
    files: [
      /* targets */
      { pattern: 'src/tracker/private/libs/*[!(.d)].ts' },

      /* tests */
      { pattern: 'test/benchmark/*.ts' }
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      /* targets */
      'src/tracker/private/libs/*[!(.d)].ts': ['karma-typescript'],

      /* tests */
      'test/benchmark/*.ts': ['karma-typescript']
    }
  })
  delete customConfig.karmaTypescriptConfig.reports
  return customConfig
})
