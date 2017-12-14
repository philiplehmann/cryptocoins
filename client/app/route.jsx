import React, { Component } from 'react'
import List from './list'
import Config from './config'

import io from 'socket.io-client'

class Route extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coins: {},
      config: JSON.parse(localStorage.getItem('config') || '{}'),
      connected: false
    }
    this.socket = io('http://localhost:5100')
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
    return  <View coins={coins} config={config} connected={connected} updateConfig={this.updateConfig}/>
  }
}

export default Route
