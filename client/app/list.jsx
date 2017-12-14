import React, { Component } from 'react'

const currencies = {
  chf: 'CHF',
  usd: '$',
  eur: '€'
}

export const sortKeys = (coins) => (a, b) => {
  const arrA = coins[a]
  const arrB = coins[b]
  const coinA = arrA[arrA.length - 1]
  const coinB = arrB[arrB.length - 1]
  return Number(coinA.rank) - Number(coinB.rank)
}

const round = (value, decimals = 2) => {
  return Math.round(Number(value) * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

const formatNumber = (number, decimals = 2) => {
  number = round(number, decimals)
  return `${number}`.replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1\'')
}

class CoinList extends Component {

  constructor(props) {
    super(props)
    this.showConfig = this.showConfig.bind(this)
  }

  showConfig() {
    const { config, updateConfig } = this.props
    updateConfig(Object.assign(config, { view: 'config' }))
  }

  render() {
    const { coins, config } = this.props
    const currency = config.currency || 'usd'
    const configCoins = config.coins || {}
    const keys = Object.keys(coins || {}).filter((k) => configCoins[k] != undefined)
    keys.sort(sortKeys(coins))
    let total = 0
    return <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">rank</th>
          <th scope="col">symbol</th>
          <th scope="col">name</th>
          <th scope="col">24h volume</th>
          <th scope="col">market cap</th>
          <th scope="col">price</th>
          <th scope="col">1h</th>
          <th scope="col">24h</th>
          <th scope="col">7d</th>
          <th scope="col">you</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((key) => {
          const arr = coins[key]
          const coin = arr[arr.length - 1]
          const you = Number(coin[`price_${currency}`]) * Number(configCoins[key])
          total += you
          const arr2 = [].concat(arr)
          arr2.reverse()
          const coin1h = arr2.find((c) => Number(c.percent_change_1h) != Number(coin.percent_change_1h)) || arr[0]
          const coin24h = arr2.find((c) => Number(c.percent_change_24h) != Number(coin.percent_change_24h)) || arr[0]
          const coin7d = arr2.find((c) => Number(c.percent_change_7d) != Number(coin.percent_change_7d)) || arr[0]
          return <tr key={coin.id}>
            <td>{coin.rank}</td>
            <td>{coin.symbol}</td>
            <td>{coin.name}</td>
            <td>{formatNumber(coin[`24h_volume_${currency}`], 0)} {currencies[currency]}</td>
            <td>{formatNumber(coin[`market_cap_${currency}`], 0)} {currencies[currency]}</td>
            <td>{formatNumber(coin[`price_${currency}`])} {currencies[currency]}</td>
            <td>
              {coin.percent_change_1h}%
              {coin.percent_change_1h > coin1h.percent_change_1h && '↑'}
              {coin.percent_change_1h < coin1h.percent_change_1h && '↓'}
              {coin.percent_change_1h == coin1h.percent_change_1h && '→'}
            </td>
            <td>
              {coin.percent_change_24h}%
              {coin.percent_change_24h > coin24h.percent_change_24h && '↑'}
              {coin.percent_change_24h < coin24h.percent_change_24h && '↓'}
              {coin.percent_change_24h == coin24h.percent_change_24h && '→'}
            </td>
            <td>
              {coin.percent_change_7d}%
              {coin.percent_change_7d > coin7d.percent_change_7d && '↑'}
              {coin.percent_change_7d < coin7d.percent_change_7d && '↓'}
              {coin.percent_change_7d == coin7d.percent_change_7d && '→'}
            </td>
            <td>{(Number(configCoins[key]) > 0) && formatNumber(you)} {currencies[currency]}</td>
          </tr>
        })}
        <tr>
          <td colSpan="8"></td>
          <td>total</td>
          <td>{formatNumber(total)} {currencies[currency]}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="10" className="text-center"><button type="button" onClick={this.showConfig}>config</button></td>
        </tr>
      </tfoot>
    </table>
  }
}

export default CoinList
