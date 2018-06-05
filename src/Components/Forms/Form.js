import React from 'react'

const capitalize = str => {
  return str[0].toUpperCase() + str.substr(1, str.length)
}

export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  clearValues() {
    const names = this.props.fields.map(field => field.name)
    const state = names.reduce((obj, name) => {
      obj[name] = ''
      return obj
    }, {})
    this.setState(state)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    const values = getValues(event.target.elements)
    event.preventDefault()
    this.props.onSubmit(values)
    this.clearValues()
  }

  render() {
    const {fields} = this.props
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className={this.props.className}>
        {(fields || []).map(field => (
          <label className="form-field" key={`Field-${field.name}`}>
            <span>
              {field.label || capitalize(field.name)}
            </span>
            <input
              type={field.type}
              name={field.name}
              value={this.state[field.name] || ''}
              onChange={this.handleChange.bind(this)} />
          </label>
        ))}
        <div className="card-actions">
          <button type="submit" className="button primary">
            {this.props.submitLabel}
          </button>
          {this.props.secondaryAction &&
            this.props.secondaryAction()}
        </div>
      </form>
    )
  }
}

function getValues(elements) {
  return Array.from(elements)
    .filter(input => input.value)
    .map(({name, value}) => ({name, value}))
}
