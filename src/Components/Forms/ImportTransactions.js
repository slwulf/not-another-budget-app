import React from 'react'
import {Link} from 'react-router-dom'

import Form from './Form'

export default class ImportTransactions extends React.Component {
  constructor(props) {
    super(props)
  }

  onSubmit(values) {
    console.log(values)
  }

  render(props) {
    return <Form
      onSubmit={this.onSubmit.bind(this)}
      submitLabel="Import"
      fields={[{
        type: 'textarea',
        name: 'transactions'
      }]} />
  }
}
