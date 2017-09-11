/* global require process __dirname */
/* eslint no-console: off */

const Webpack = require('webpack')
const path = require('path')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../webpack/config')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const https = require('https')



const compiler = Webpack([config])

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 5000
const webpackServer = new WebpackDevServer(compiler, {
  inline: true,
  stats: { colors: true },
  contentBase: path.resolve('public'),
  https: false,
  host: HOST,
  port: PORT,
  public: `${HOST}:${PORT}`
})
webpackServer.listen(PORT, HOST)



const coins = ['bitcoin', 'ethereum']
const currency = 'EUR'

const downloadUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const contentType = res.headers['content-type']

      if (res.statusCode !== 200) {
        reject('Request Failed.\n' + `Status Code: ${res.statusCode}`)
        return res.resume()
      } else if (!/^application\/json/.test(contentType)) {
        reject('Invalid content-type.\n' + `Expected application/json but received ${contentType}`)
        return res.resume()
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          resolve(parsedData)
        } catch (e) {
          reject(e.message)
        }
      })
    }).on('error', (e) => {
      reject(`Got error: ${e.message}`)
    })
  })
}

server.listen(5100)

io.on('connection', (socket) => {
  setInterval(() => {
    coins.forEach((coin) => {
      downloadUrl(`https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${currency}`).then((data) => {
        socket.emit('coin', data[0])
      }, (error) => {
        console.error(error)
      })
    })
  }, 10000)

  // socket.on('my other event', (data) => {
  //   console.log(data);
  // });
});
