import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import Header from './Components/Header'
import Card from './Components/Card'
import * as Forms from './Components/Forms'
import * as Panels from './Containers/Panels'
import './Style/base.scss'

export default function App() {
  return (
    <Router>
      <React.Fragment>
        <Route exact path="/" render={() => <Redirect to="/transactions" />} />
        <div className="wrapper">
          <Header navigation={[
            { to: '/transactions', label: 'Transactions' },
            { to: '/budgets', label: 'Budgets' },
            { to: '/reports', label: 'Reports' }
          ]} />
          <Panels.Form />
          <Panels.Summary />
          <Panels.Details />
        </div>
      </React.Fragment>
    </Router>
  )
}
