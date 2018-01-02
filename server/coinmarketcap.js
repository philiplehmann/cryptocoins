/* global require module */
/* eslint no-console: off */
const https = require('https')
const fs = require('fs')

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

const fetchCoinsSuccess = (coinData, resolve) => (arr) => {
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

  resolve(coinData, sendData)

  fs.writeFile('coinData.json', JSON.stringify(coinData), 'utf8', (err) => {
    if (err) console.error(err)
  })
}

const fetchCoins = (coinData) => {
  return new Promise((resolve, reject) => {
    const promises = currencies.map(currency => {
      return downloadUrl(`https://api.coinmarketcap.com/v1/ticker/?convert=${currency}&start=0&limit=1100`)
    })
    Promise.all(promises).then(
      fetchCoinsSuccess(coinData, resolve),
      reject
    )
  })

}

module.exports = fetchCoins
