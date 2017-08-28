var defaultConfig = require('./config')

module.exports = function (customConfig) {
  return function (config) {
    config.set(
      Object.assign({},
        defaultConfig,
        // default config fields based on runtime karma config
        {
          // level of logging
          // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
          logLevel: config.LOG_INFO
        },
        customConfig
      )
    )
    if (process.env.TRAVIS) {
      config.browsers = ['Chrome_travis_ci']
      config.singleRun = true
    }
  }
}
