var defaultConfig = require('./config')

module.exports = function (customizer) {
  return function (config) {
    config.set(customizer(defaultConfig))

    if (process.env.TRAVIS) {
      config.browsers = ['Chrome_travis_ci']
      config.singleRun = true
    }
  }
}
