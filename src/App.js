import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import Header from './Components/Header'
import './Style/base.scss'

export default function App() {
  return (
    <Router>
      <div className="wrapper">
        <Header navigation={[
          { to: '/transactions', label: 'Transactions' },
          { to: '/budgets', label: 'Budgets' },
          { to: '/reports', label: 'Reports' }
        ]} />
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/transactions" />} />
          <Route path="/transactions" render={() => <p>transactions!</p>} />
          <Route path="/budgets" render={() => <p>budgets!</p>} />
          <Route path="/reports" render={() => <p>reports!</p>} />
        </Switch>
      </div>
    </Router>
  )
}
