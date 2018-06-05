import React from 'react'

const Actions = ({actions = {}}) =>
  <div className="card-actions">
    {actions.primaryLabel &&
      <button
        type="button"
        className="button primary"
        onClick={actions.primary}>
        {actions.primaryLabel}
      </button>
    }
    {actions.secondaryLabel &&
      <button
        type="button"
        className="button secondary link"
        onClick={actions.secondary}>
        {actions.secondaryLabel}
      </button>
    }
  </div>

export default function CreateTransaction(props) {
  return <React.Fragment>
    <pre>{JSON.stringify(props, null, 2)}</pre>
    <Actions actions={props.actions} />
  </React.Fragment>
}
