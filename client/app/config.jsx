import React, { Component } from 'react'
import { sortKeys } from './list'

class Config extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.showList = this.showList.bind(this)
  }

  changeConfig(event, key) {
    const { config, updateConfig } = this.props

    const configCoins = config.coins || {}
    if(configCoins[key] != undefined) {
      delete configCoins[key]
    } else {
      configCoins[key] = ''
    }
    updateConfig(Object.assign(config, { coins: configCoins }))
  }

  changeValueConfig(event, key) {
    const { config, updateConfig } = this.props
    const configCoins = config.coins || {}
    configCoins[key] = event.target.value
    updateConfig(Object.assign(config, { coins: configCoins }))
  }

  showList() {
    const { config, updateConfig } = this.props
    updateConfig(Object.assign(config, { view: 'list' }))
  }

  changeCurrency(currency) {
    const { config, updateConfig } = this.props
    updateConfig(Object.assign(config, { currency: currency }))
  }

  render() {
    const { coins, config } = this.props
    const currency = config.currency || 'usd'
    const keys = Object.keys(coins)
    const configCoins = config.coins || {}
    keys.sort(sortKeys(coins))
    return <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">visible</th>
            <th scope="col">name</th>
            <th scope="col">amount</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            const coin = coins[key][0]
            const hasKey = configCoins[key] != undefined
            return <tr key={coin.id}>
              <td>
                <input type="checkbox" checked={hasKey} onChange={(e) => this.changeConfig(e, key)}/>
              </td>
              <td>
                {coin.name}
              </td>
              <td>{hasKey && <input type="text" value={configCoins[key]} onChange={(e) => this.changeValueConfig(e, key)}/>}</td>
            </tr>
          })}
        </tbody>
      </table>
      <table className="table">
        <tbody>
          <tr>
            <td className={currency == 'chf' && 'table-info'} onClick={() => this.changeCurrency('chf')}>CHF</td>
            <td className={currency == 'usd' && 'table-info'} onClick={() => this.changeCurrency('usd')}>USD</td>
            <td className={currency == 'eur' && 'table-info'} onClick={() => this.changeCurrency('eur')}>EUR</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-center"><button type="button" onClick={this.showList}>list</button></td>
          </tr>
        </tfoot>
      </table>
    </div>
  }
}

export default Config
