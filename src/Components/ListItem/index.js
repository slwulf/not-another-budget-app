import React from 'react'

import './index.scss'

export default function ListItem(props) {
  return (
    <div className="list-item">
      {props.onDelete &&
        <button type="button"
        className="list-item-delete"
        onClick={() => props.onDelete()}>
          ×
        </button>
      }
      {props.children}
    </div>
  )
}
