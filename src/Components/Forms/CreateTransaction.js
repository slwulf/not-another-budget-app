import React from 'react'
import {Link} from 'react-router-dom'

import Form from './Form'
import * as Api from '../../Utility/Api'

export default class CreateTransaction extends React.Component {
  constructor(props) {
    super(props)
  }

  onSubmit(values) {
    Api.Transactions.post('/new', values)
      .then(response => console.log('server response:', response))
      .catch(error => console.log('oh noes!', error))
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
        type: 'text',
        name: 'category'
        // TODO: make this an autocomplete
        // with free entry & list of categories
      }]} />
  }
}
