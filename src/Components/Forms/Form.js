import React from 'react'

const capitalize = str => {
  return str[0].toUpperCase() + str.substr(1, str.length)
}

const FormField = props => (
  <label className="form-field">
    <span>{props.label}</span>
    {props.children}
  </label>
)

const Field = props => {
  const key = `Field-${props.name}`
  const label = props.label || capitalize(props.name)

  switch (props.type) {
    case 'textarea':
      return (
        <FormField key={key} label={label}>
          <textarea
            name={props.name}
            value={props.value || ''}
            onChange={props.onChange} />
        </FormField>
      )
    case 'autocomplete':
      return (
        <FormField key={key} label={label}>
          <p>autocomplete</p>
        </FormField>
      )
    default:
      return (
        <FormField key={key} label={label}>
          <input
            autocomplete="off"
            type={props.type}
            name={props.name}
            value={props.value || ''}
            onChange={props.onChange} />
        </FormField>
      )
  }
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
          <Field
            value={this.state[field.name]}
            onChange={this.handleChange.bind(this)}
            {...field} />
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
    .reduce((values, {name, value}) => {
      values[name] = value
      return values
    }, {})
}
