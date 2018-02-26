// @REQUIRE: contentscript should be built after injectscript has been built
// @NOTE: Webpack Multi-compiler is not working here, which will compile files in parallel [https://stackoverflow.com/questions/29640996/webpack-with-an-array-provided-as-config]
// @NOTE: Webpack Node API, using callback to realize synchronous compilation [https://webpack.js.org/api/node/]
const webpack = require('webpack')
const config = require('./config.js')
const compile = (config, callback) => {
  const compiler = webpack(config)
  const _callback = callback || function (err, stats) {
    return err
      ? console.error(err)
      : console.log(stats.toString({ colors: true }))
  }
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      resolve(_callback(err, stats))
    })
  })
}
const injectscriptConfig = Object.assign({}, config, {
  entry: {
    tracker: './src/tracker/index.ts'
  }
})
const extensionConfig = Object.assign({}, config, {
  entry: {
    contentscript: './src/extension/contentscript.ts',
    background: './src/extension/background.ts',
    devtool: './src/extension/devtool.ts',
    StaticFilesPacker: './src/extension/StaticFilesPacker.ts'
  }
})
compile(injectscriptConfig)
  .then(() => compile(extensionConfig))
