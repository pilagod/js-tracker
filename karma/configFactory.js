// Karma configuration
// Generated on Fri Sep 02 2016 13:05:56 GMT+0800 (CST)

module.exports = function (customConfig) {
  return function (config) {
    config.set(Object.assign({}, customConfig, {
      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO
    }))
    if (process.env.TRAVIS) {
      config.browsers = ['Chrome_travis_ci']
      config.singleRun = true
    }
  }
}
