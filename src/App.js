import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'

import Header from './Components/Header'
import './Style/base.scss'

export default function App() {
  return (
    <Router>
      <div className="wrapper">
        <Header navigation={[
          { to: '/', label: 'Transactions' },
          { to: '/budgets', label: 'Budgets' },
          { to: '/reports', label: 'Reports' }
        ]} />
        <p>thinger!</p>
      </div>
    </Router>
  )
}
