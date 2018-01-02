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

const getCoin = (coins) => (key) => {
  const arr = coins[key]
  return arr[arr.length - 1]
}

const getChange = (coins) => (key) => {
  const arr = coins[key]
  const coin = arr[arr.length - 1]
  const arr2 = [].concat(arr)
  arr2.reverse()

  return (field) => {
    return arr2.find((c) => Number(c[field]) != Number(coin[field])) || arr[0]
  }
}

const getPercentage = (coins, keys, config) => (field, total) => {
  return keys.reduce((number, key) => {
    const coin = getCoin(coins)(key)
    const currency = config.currency || 'usd'
    const configCoins = config.coins || {}
    const coinBalance = Number(configCoins[key])
    const yourAmount = Number(coin[`price_${currency}`]) * coinBalance
    return Math.round((number + Number(coin[field] / 100 * (100 / total * yourAmount))) * 100) / 100
  }, 0)
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

  renderTable() {
    const { coins, config } = this.props
    const currency = config.currency || 'usd'
    const configCoins = config.coins || {}
    const keys = Object.keys(coins || {}).filter((k) => configCoins[k] != undefined)
    keys.sort(sortKeys(coins))
    let total = 0
    const fetchCoin = getCoin(coins)
    const fetchChange = getChange(coins)
    const fetchPercentage = getPercentage(coins, keys, config)
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
          <th scope="col">balance</th>
          <th scope="col">{currencies[currency]}</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((key) => {
          const coin = fetchCoin(key)
          const coinBalance = Number(configCoins[key])
          const yourAmount = Number(coin[`price_${currency}`]) * coinBalance
          total += yourAmount
          const coinChange = fetchChange(key)
          const coin1h = coinChange('percent_change_1h')
          const coin24h = coinChange('percent_change_24h')
          const coin7d = coinChange('percent_change_7d')
          return <tr key={coin.id}>
            <td>{coin.rank}</td>
            <td>{coin.symbol}</td>
            <td>{coin.name}</td>
            <td>{formatNumber(coin[`24h_volume_${currency}`], 0)} {currencies[currency]}</td>
            <td>{formatNumber(coin[`market_cap_${currency}`], 0)} {currencies[currency]}</td>
            <td>{formatNumber(coin[`price_${currency}`])} {currencies[currency]}</td>
            <td className={coin.percent_change_1h > coin1h.percent_change_1h ? 'table-success' : 'table-warning' }>
              {coin.percent_change_1h}%
              {coin.percent_change_1h > coin1h.percent_change_1h && '↑'}
              {coin.percent_change_1h < coin1h.percent_change_1h && '↓'}
              {coin.percent_change_1h == coin1h.percent_change_1h && '→'}
            </td>
            <td className={coin.percent_change_24h > coin24h.percent_change_24h ? 'table-success' : 'table-warning' }>
              {coin.percent_change_24h}%
              {coin.percent_change_24h > coin24h.percent_change_24h && '↑'}
              {coin.percent_change_24h < coin24h.percent_change_24h && '↓'}
              {coin.percent_change_24h == coin24h.percent_change_24h && '→'}
            </td>
            <td className={coin.percent_change_7d > coin7d.percent_change_7d ? 'table-success' : 'table-warning' }>
              {coin.percent_change_7d}%
              {coin.percent_change_7d > coin7d.percent_change_7d && '↑'}
              {coin.percent_change_7d < coin7d.percent_change_7d && '↓'}
              {coin.percent_change_7d == coin7d.percent_change_7d && '→'}
            </td>
            <td>{Number(configCoins[key])}</td>
            <td>{(Number(configCoins[key]) > 0) && formatNumber(yourAmount)}</td>
          </tr>
        })}
        <tr>
          <td colSpan="5"></td>
          <td>total</td>
          <td>{fetchPercentage('percent_change_1h', total)}%</td>
          <td>{fetchPercentage('percent_change_24h', total)}%</td>
          <td>{fetchPercentage('percent_change_7d', total)}%</td>
          <td></td>
          <td>{formatNumber(total)} {currencies[currency]}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="10" className="text-center">
            <button type="button" className="btn btn-light" onClick={this.showConfig}>Config</button>
          </td>
        </tr>
      </tfoot>
    </table>
  }

  renderLoading() {
    const { connected } = this.props
    return (connected ? <span>Loading...</span> : <div><span>Data not up to date, cannot connect to server!</span>{this.renderTable()}</div>)
  }

  render() {
    const { connected, coins, config } = this.props
    const configCoins = config.coins || {}
    return ((connected && Object.keys(coins || {}).filter((k) => configCoins[k] != undefined).length > 0) ? this.renderTable() : this.renderLoading())
  }
}

export default CoinList
