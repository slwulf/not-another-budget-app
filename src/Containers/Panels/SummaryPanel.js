import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Card from '../../Components/Card'
import * as Forms from '../../Components/Forms'

export default function SummaryPanel() {
  return (
    <section className="summary-panel">
      <Switch>
        <Route path="/transactions" render={() => <p>transactions summary!</p>} />
        <Route path="/budgets" render={() => <p>budgets summary!</p>} />
      </Switch>
    </section>
  )
}
