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
    return <React.Fragment>
      <Form
        onSubmit={this.onSubmit.bind(this)}
        submitLabel="Add Transaction"
        secondaryAction={() => (
          <Link to="/import" className="link secondary">
            Import...
          </Link>
        )}
        fields={[{
          type: 'text',
          name: 'description'
        }, {
          type: 'number',
          name: 'amount'
        }]} />
    </React.Fragment>
  }
}
