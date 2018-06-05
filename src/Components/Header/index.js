import React from 'react'
import {Link} from 'react-router-dom'

const NavItem = props =>
  <Link className="header-nav-item" to={props.to}>
    {props.label}
  </Link>

export default function Header({navigation = []}) {
  return (
    <div className="header">
      <nav className="header-nav">
        {
          navigation.map(nav =>
            <NavItem key={`NavItem-${nav.to}`} {...nav} />)
        }
      </nav>
    </div>
  )
}
