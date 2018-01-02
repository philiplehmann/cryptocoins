/* global require */
/* eslint no-console: off */

const Webpack = require('webpack')
const config = require('./webpack/config.prod')

const compiler = Webpack(config)
compiler.run((...args) => {
  console.log.apply(console, args)
})
