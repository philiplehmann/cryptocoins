/* global require process __dirname */
/* eslint no-console: off */

require('dotenv').config()
const Webpack = require('webpack')
const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
const fetchCoins = require('./coinmarketcap')

const PUBLIC_DIR = path.join(__dirname, '../public')
const isDevelopment = process.env.NODE_ENV !== 'production'

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 5000

if(isDevelopment) {
  const config = require('../webpack/config.dev')
  const compiler = Webpack(config)
  app.use(webpackDevMiddleware(compiler))
  app.use(webpackHotMiddleware(compiler))
  app.use(express.static(PUBLIC_DIR))
} else {
  app.use(express.static(PUBLIC_DIR))
}

server.listen(PORT, HOST)

let coinData = {}

const loadCoins = () => {
  fetchCoins(coinData).then((data, sendData) => {
    coinData = data
    console.log('send coinUpdate')
    io.emit('coinUpdate', sendData)
  }, (err) => {
    console.error(err)
  })
}

setInterval(loadCoins, 5 * 60 * 1000)
fs.readFile(path.resolve('coinData.json'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
  } else {
    coinData = JSON.parse(data)
  }
  fetchCoins(coinData).catch((err) => {
    console.error(err)
  })
})

io.on('connection', socket => {
  console.info('new connection')
  socket.emit('coinInit', coinData)

  socket.on('disconnect', () => {
    console.info('connection lost')
  })
})
