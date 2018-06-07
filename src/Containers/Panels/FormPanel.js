import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Card from '../../Components/Card'
import * as Forms from '../../Components/Forms'

export default function FormPanel() {
  return (
    <section className="form-panel">
      <Switch>
        <Route exact path="/transactions" render={() => (
          <Card title="Add a Transaction">
            <Forms.CreateTransaction
              onSubmit={state => {
                console.log('hello from app', state)
              }} />
          </Card>
        )} />
        <Route exact path="/transactions/import" render={() => (
          <Card title="Import Transactions">
            <Forms.ImportTransactions
              onSubmit={state => {
                console.log('hello from app', state)
              }} />
          </Card>
        )} />
        <Route path="/budgets" render={() => (
          <Card title="Add a Budget">
            <Forms.CreateBudget
              onSubmit={state => {
                console.log('hello from app', state)
              }} />
          </Card>
        )} />
      </Switch>
    </section>
  )
}
