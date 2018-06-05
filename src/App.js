import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'

import Header from './Components/Header'

export default function App() {
  return (
    <Router>
      <React.Fragment>
        <Header navigation={[
          { to: '/', label: 'Transactions' },
          { to: '/budgets', label: 'Budgets' },
          { to: '/reports', label: 'Reports' }
        ]} />
        <p>thinger!</p>
      </React.Fragment>
    </Router>
  )
}
