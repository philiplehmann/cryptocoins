/*global require module*/
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const config = require('./config')

module.exports = merge(config, {
  mode: 'development',
  output: {
    sourceMapFilename: '[file].map'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
