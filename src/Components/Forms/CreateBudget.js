import React from 'react'
import {Link} from 'react-router-dom'

import Form from './Form'
import * as Api from '../../Utility/Api'

export default class CreateBudget extends React.Component {
  constructor(props) {
    super(props)
  }

  onSubmit(values) {
    Api.Budgets.post('/new', values)
      .then(response => console.log('server response: ', response))
      .catch(error => console.log('oops!', error))
  }

  render(props) {
    return <Form
      onSubmit={this.onSubmit.bind(this)}
      submitLabel="Add Budget"
      fields={[{
        type: 'text',
        name: 'category'
        // TODO: make this an autocomplete
        // with free entry & list of categories
      }, {
        type: 'text',
        name: 'amount'
      }]} />
  }
}
