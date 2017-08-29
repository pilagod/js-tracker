var defaultConfig = require('./config')

module.exports = function (customizer) {
  return function (config) {
    var customConfig = customizer(defaultConfig)
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    customConfig.logLevel = config.LOG_INFO

    config.set(customConfig)

    if (process.env.TRAVIS) {
      config.browsers = ['Chrome_travis_ci']
      config.singleRun = true
    }
  }
}
