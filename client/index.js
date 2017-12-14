import React from 'react'
import ReactDOM from 'react-dom'
import Route from 'app/route'

window.onload = function() {
  ReactDOM.render(<Route/>, document.querySelector('#app'))
}
