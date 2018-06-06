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
        <section className="form-panel">
          <Switch>
            <Route exact path="/transactions" render={() => (
              <Card
                title="Add a Transaction"
                children={(
                  <Forms.CreateTransaction
                    onSubmit={state => {
                      console.log('hello from app', state)
                    }} />
                )} />
            )} />
            <Route exact path="/transactions/import" render={() => (
              <Card
                title="Import Transactions"
                children={(
                  <Forms.ImportTransactions
                    onSubmit={state => {
                      console.log('hello from app', state)
                    }} />
                )} />
            )} />
            <Route path="/budgets" render={() => <p>add budgets!</p>} />
          </Switch>
        </section>
        <section className="summary-panel">
          <Switch>
            <Route path="/transactions" render={() => <p>transactions summary!</p>} />
            <Route path="/budgets" render={() => <p>budgets summary!</p>} />
          </Switch>
        </section>
        <section className="details-panel">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/transactions" />} />
            <Route path="/transactions" render={() => <p>transactions list!</p>} />
            <Route path="/budgets" render={() => <p>budgets list!</p>} />
            <Route path="/reports" render={() => <p>reports view!</p>} />
          </Switch>
        </section>
      </div>
    </Router>
  )
}
