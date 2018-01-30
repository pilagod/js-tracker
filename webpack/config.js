const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx']
  },
  // issue: [https://github.com/webpack-contrib/css-loader/issues/447]
  node: {
    fs: 'empty'
  },
  module: {
    // @NOTE: loader parsing order is right to left
    loaders: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'transform-loader?brfs!awesome-typescript-loader'
      }
    ]
  }
}
