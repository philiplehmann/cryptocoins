/* global require process */
/* eslint no-console: off */

const Webpack = require('webpack')
const path = require('path')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../webpack/config')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const https = require('https')
const fs = require('fs')

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

//const coins = ['bitcoin', 'ethereum', 'aragon', 'augur', 'basic-attention-token', 'dash', 'decred', 'golem', 'litecoin', 'omisego', 'qtum']
const currencies = ['USD', 'CHF', 'EUR']

const downloadUrl = url => {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
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
        res.on('data', chunk => {
          rawData += chunk
        })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            reject(e.message)
          }
        })
      })
      .on('error', e => {
        reject(`Got error: ${e.message}`)
      })
  })
}

server.listen(5100)

let coinData = {}

const fetchCoins = () => {
  const promises = currencies.map(currency => {
    return downloadUrl(`https://api.coinmarketcap.com/v1/ticker/?convert=${currency}&start=0&limit=1100`)
  })
  Promise.all(promises).then(
    arr => {
      const sendData = arr[0].map((entry, index) => {
        const data = arr.reduce((obj, secondArr) => {
          return Object.assign(obj, secondArr[index])
        }, {})
        const coinArr = coinData[data.id] || []
        const newArr = coinArr.concat(data)
        if (newArr.length > 100) newArr.shift()
        coinData[data.id] = newArr
        return data
      })

      console.log('send coinUpdate')
      io.emit('coinUpdate', sendData)

      fs.writeFile('coinData.json', JSON.stringify(coinData), 'utf8', err => {
        if (err) console.log(err)
      })
    },
    () => {
      io.emit('coinDisconnect')
    }
  )
}

setInterval(fetchCoins, 60 * 1000)
fs.readFile('coinData.json', 'utf8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    coinData = JSON.parse(data)
    fetchCoins()
  }
})

io.on('connection', socket => {
  console.log('new connection compiled')
  socket.emit('coinInit', coinData)

  socket.on('disconnect', () => {
    console.log('connection lost')
  })
})
