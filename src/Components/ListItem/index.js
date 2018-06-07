import React from 'react'

import './index.scss'

export default function ListItem(props) {
  return (
    <div className="list-item">
      {props.children}
    </div>
  )
}
