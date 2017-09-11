import React, { Component } from 'react'

import io from 'socket.io-client'

class CoinList extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.socket = io('http://localhost:5100')
  }

  componentDidMount() {
    this.socket.on('coin', (data) => {
      this.setState({
        [data.id]: data
      })
    })
  }

  componentWillUnmount() {
    this.socket.off('coin')
  }

  render() {
    const keys = Object.keys(this.state)
    return <table>
      <thead>
        <tr>
          <th>symbol</th>
          <th>name</th>
          <th>€</th>
          <th>1h</th>
          <th>24h</th>
          <th>7d</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((key) => {
          const coin = this.state[key]
          return <tr key={coin.id}>
            <td>{coin.symbol}</td>
            <td>{coin.name}</td>
            <td>{coin.price_eur}</td>
            <td>{coin.percent_change_1h}</td>
            <td>{coin.percent_change_24h}</td>
            <td>{coin.percent_change_7d}</td>
          </tr>
        })}
      </tbody>
    </table>
  }
}

export default CoinList
