// Karma configuration
// Generated on Fri Sep 02 2016 13:05:56 GMT+0800 (CST)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'karma-typescript', // https://www.npmjs.com/package/karma-typescript
      'mocha'
    ],

    // list of files / patterns to load in the browser
    // all modules including in tests should be included here
    files: [
      { pattern: 'src/tracker/**/*.ts' },
      { pattern: 'src/Sidebar/*.tsx' },
      { pattern: 'src/contentscript.ts' },
      { pattern: 'src/MessageType.ts' },

      { pattern: 'test/*.ts' },
      { pattern: 'test/test-script.js', served: true, included: false }
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/tracker/**/*[!(.d)].ts': ['karma-typescript', 'coverage'],
      'src/Sidebar/*.tsx': ['karma-typescript', 'coverage'],
      'src/contentscript.ts': ['karma-typescript', 'coverage'],
      'src/MessageType.ts': ['karma-typescript', 'coverage'],

      'test/*.ts': ['karma-typescript']
    },

    karmaTypescriptConfig: {
      reports: {
        'html': 'coverage',
        'text-summary': ''
      },
      tsconfig: './tsconfig.json'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['karma-typescript', 'coverage', 'mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    browserConsoleLogOptions: {
      level: 'log',
      terminal: true
    },

    // http://blog.500tech.com/setting-up-travis-ci-to-run-tests-on-latest-google-chrome-version/
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })

  if (process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci']
    config.singleRun = true
  }
}
