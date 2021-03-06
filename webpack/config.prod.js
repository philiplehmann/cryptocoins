/*global require module*/
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const config = require('./config')

module.exports = merge(config, {
  mode: 'production',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    })
  ]
})
