/* global require module process */
/* eslint no-console: off */
const fs = require('fs')
const path = require('path')
const rp = require('request-promise')


//const coins = ['bitcoin', 'ethereum', 'aragon', 'augur', 'basic-attention-token', 'dash', 'decred', 'golem', 'litecoin', 'omisego', 'qtum']
const currencies = ['USD', 'CHF', 'EUR']
const apiKey = process.env.COINMARKETCAP_API_KEY

const getOptions = (currency) => {
  return {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      'start': '1',
      'limit': '5000',
      'convert': currency
    },
    headers: {
      'X-CMC_PRO_API_KEY': apiKey
    },
    json: true,
    gzip: true
  }
}

const fetchCoinsSuccess = (coinData, resolve) => (arr) => {
  console.log(JSON.stringify(arr, null, 2))
  const sendData = arr[0].data.map((entry, index) => {
    const data = arr.reduce((obj, secondArr) => {
      return Object.assign(obj, secondArr[index])
    }, {})
    const coinArr = coinData[data.id] || []
    const newArr = coinArr.concat(data)
    if (newArr.length > 100) newArr.shift()
    coinData[data.id] = newArr
    return data
  })

  resolve(coinData, sendData)

  fs.writeFile(path.resolve('coinData.json'), JSON.stringify(coinData), 'utf8', (err) => {
    if (err) console.error(err)
  })
}

const fetchCoins = (coinData) => {
  return new Promise((resolve, reject) => {
    const promises = currencies.map((currency) => {
      return rp(getOptions(currency))
    })
    Promise.all(promises).then(
      fetchCoinsSuccess(coinData, resolve),
      reject
    )
  })

}

module.exports = fetchCoins
