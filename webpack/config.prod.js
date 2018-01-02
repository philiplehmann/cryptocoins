/*global require module*/
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./config')

module.exports = merge.smart(config, {
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
  ]
})
