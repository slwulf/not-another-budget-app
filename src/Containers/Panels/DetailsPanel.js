import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Card from '../../Components/Card'
import ListItem from '../../Components/ListItem'
import * as Forms from '../../Components/Forms'

const deleteTransaction = id => () =>
  console.log('deleting transaction: ' + id)

export default function DetailsPanel() {
  return (
    <section className="details-panel">
      <Switch>
        <Route path="/transactions" render={renderTransactions} />
        <Route path="/budgets" render={() => <p>budgets list!</p>} />
        <Route path="/reports" render={() => <p>reports view!</p>} />
      </Switch>
    </section>
  )
}

function renderTransactions(props) {
  return (
    <React.Fragment>
      <h2>Transactions</h2>
      {
        makeTransactions(5).map(transaction => (
          <ListItem
            key={`Transaction-${transaction.id}`}
            onDelete={deleteTransaction(transaction.id)}>
            <span>{transaction.category}</span>
            <span>{transaction.date} - {transaction.description}</span>
            <span>{transaction.amount}</span>
          </ListItem>
        ))
      }
    </React.Fragment>
  )
}

function makeTransactions(amount) {
  const arr = []
  for (let i = 0; i < amount; i++) {
    arr.push({
      id: i,
      description: 'dummy ' + i,
      amount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
      category: 'Stuff',
      date: Date.now()
    })
  }
  return arr
}
