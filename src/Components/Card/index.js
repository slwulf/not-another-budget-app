import React from 'react'

import './index.scss'

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

export default function Card(props) {
  return (
    <div className="card">
      <h3 className="card-title">{props.title}</h3>
      {props.children}
      {props.actions && <Actions actions={props.actions} />}
    </div>
  )
}
