import React from 'react'
import ReactDOM from 'react-dom'
import CoinList from 'app/list'

window.onload = function() {
  ReactDOM.render(<CoinList/>, document.querySelector('#app'))
}
