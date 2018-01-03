import React, { Component } from 'react'
import List from './list'
import Config from './config'

import io from 'socket.io-client'

const LinkItem = (props) => {
  const { label, value, config, updateConfig, property } = props
  const active = config.view == value
  return <li className="nav-item">
    <a
      className={active ? 'nav-link active' : 'nav-link'}
      href="#"
      onClick={() => updateConfig(Object.assign(config, { [property]: value }))}>
      {label}
    </a>
  </li>
}

class Route extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coins: {},
      config: JSON.parse(localStorage.getItem('config') || '{}'),
      connected: false
    }
    this.socket = io(window.location.protocol + '//' + window.location.host)
    this.updateConfig = this.updateConfig.bind(this)
  }

  componentDidMount() {
    this.socket.on('coinInit', (data) => {
      this.setState({ coins: data, connected: true })
    })
    this.socket.on('coinDisconnect', () => {
      this.setState({ connected: false })
    })
    this.socket.on('coinUpdate', (arr) => {
      if(!arr) return
      const { coins } = this.state
      const newCoins = arr.reduce((obj, data) => {
        const arr = coins[data.id] || []
        const newArr = arr.concat(data)
        if(newArr.length > 1000) newArr.shift()
        obj[data.id] = newArr
        return obj
      }, coins)
      this.setState({
        coins: newCoins,
        connected: true
      })
    })
  }

  componentWillUnmount() {
    this.socket.off('coinInit')
    this.socket.off('coinUpdate')
  }

  updateConfig(config) {
    this.setState({
      config: config
    })
    localStorage.setItem('config', JSON.stringify(config))
  }

  render() {
    const { coins, config, connected } = this.state
    const View = (config.view == 'config') ? Config : List
    return <div>
      <div className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <LinkItem value="list" label="List" config={config} updateConfig={this.updateConfig} property="view" />
              <LinkItem value="config" label="Config" config={config} updateConfig={this.updateConfig} property="view" />
            </ul>
            <ul className="navbar-nav mr-auto">
              <LinkItem value="eur" label="€" config={config} updateConfig={this.updateConfig} property="currency" />
              <LinkItem value="usd" label="$" config={config} updateConfig={this.updateConfig} property="currency" />
              <LinkItem value="chf" label="CHF" config={config} updateConfig={this.updateConfig} property="currency" />
            </ul>
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            </form>
          </div>
        </nav>
      </div>
      <View coins={coins} config={config} connected={connected} updateConfig={this.updateConfig}/>
    </div>
  }
}

export default Route
