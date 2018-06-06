import React from 'react'
import {NavLink} from 'react-router-dom'

import './index.scss'

const NavItem = props =>
  <NavLink className="header-nav-item" to={props.to}>
    {props.label}
  </NavLink>

export default function Header({navigation = []}) {
  return (
    <div className="header">
      <nav className="header-nav">
        {
          navigation.map(nav =>
            <NavItem key={`NavItem-${nav.to}`} {...nav} />)
        }
      </nav>
      <div className="header-logo">
        <span>NAB</span>
      </div>
    </div>
  )
}
