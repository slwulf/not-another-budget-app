import React from 'react'

import './index.scss'

export default function Card(props) {
  return (
    <div className="card">
      <h3 className="card-title">{props.title}</h3>
      {typeof props.children === 'function'
        ? props.children(props)
        : props.children}
    </div>
  )
}
