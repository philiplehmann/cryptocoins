/*global require module */
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractTextPlugin = new ExtractTextPlugin({
  filename: 'styles/index.css',
  allChunks: true
})

module.exports =  {
  entry: {
    'scripts/index': [
      'babel-polyfill',
      path.resolve('client', 'index.js')
    ]
  },
  context: path.resolve('.'),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.png/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/png'
        }
      },
      {
        test: /\.jpg/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/jpeg'
        }
      },
      {
        test: /\.gif/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/gif'
        }
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'url-loader'
      },
      {
        test: /(\.scss|\.css)$/,
        loader: extractTextPlugin.extract({ fallback: 'style-loader', use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader'
          }
        ] })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.png', '.jpg'],
    alias: {
      images: path.resolve('client/assets/images'),
      styles: path.resolve('client/assets/styles'),
      app:    path.resolve('client/app')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve('public'),
    publicPath: '/',
  },
  plugins: [
    extractTextPlugin
  ]
}
