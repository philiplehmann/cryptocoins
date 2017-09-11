/*global require module process*/
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const config = require('./config')

module.exports = (wizard) => {
  const HOST = process.env.HOST || 'localhost'
  const PORT = process.env.PORT || 5200
  return merge.smart(config(wizard, 'dev'), {
    entry: {
      'scripts/index': [
        path.resolve('src', 'helpers', 'babel-polyfill.js'),
        `webpack-dev-server/client?http://${HOST}:${PORT}`,
        path.resolve('src', 'apps', wizard, 'routes.js')
      ]
    },
    resolve: {
      alias: {
        config: path.resolve('src', 'apps', wizard, 'config', 'dev')
      }
    },
    output: {
      filename: '[name].js',
      path: path.resolve(`dev/${wizard}`),
      publicPath: '/',
      sourceMapFilename: '[file].map'
    },
    devtool: 'source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  })
}
