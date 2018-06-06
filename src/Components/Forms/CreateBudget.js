import React from 'react'
import {Link} from 'react-router-dom'

import Form from './Form'

export default class CreateBudget extends React.Component {
  constructor(props) {
    super(props)
  }

  onSubmit(values) {
    console.log(values)
  }

  render(props) {
    return <Form
      onSubmit={this.onSubmit.bind(this)}
      submitLabel="Add Budget"
      fields={[{
        type: 'text',
        name: 'description'
      }, {
        type: 'text',
        name: 'category'
        // TODO: make this an autocomplete
        // with free entry & list of categories
      }]} />
  }
}
