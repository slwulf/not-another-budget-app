import React from 'react'
import {Link} from 'react-router-dom'

import Form from './Form'

export default class CreateTransaction extends React.Component {
  constructor(props) {
    super(props)
  }

  onSubmit(values) {
    console.log(values)
  }

  render(props) {
    return <Form
      onSubmit={this.onSubmit.bind(this)}
      submitLabel="Add Transaction"
      secondaryAction={() => (
        <Link to="/transactions/import" className="link secondary">
          Import...
        </Link>
      )}
      fields={[{
        type: 'text',
        name: 'description'
      }, {
        type: 'date',
        name: 'date'
      }, {
        type: 'number',
        name: 'amount'
      }, {
        type: 'autocomplete',
        name: 'category'
      }]} />
  }
}
