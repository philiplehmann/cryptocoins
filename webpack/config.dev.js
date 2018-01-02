/*global require module*/
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./config')

module.exports = merge.smart(config, {
  output: {
    sourceMapFilename: '[file].map'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
