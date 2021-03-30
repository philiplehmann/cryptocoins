/*global require module */
const path = require('path')

module.exports =  {
  entry: {
    'scripts/index': [
      path.resolve('client', 'index.js')
    ]
  },
  context: path.resolve('.'),
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
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
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
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
  }
}
