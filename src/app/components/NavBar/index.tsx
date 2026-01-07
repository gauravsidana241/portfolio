import './NavBar.scss'
import React from 'react'

interface NavItem {
    label: string;
    action: () => void;
    highlight?: boolean;
}

type NavBarProps = {
    items: NavItem[];
}

export default function NavBar({
    items
}: NavBarProps) {
  return (
    <nav className="glass-navbar">
        {items.map((item, index) => (
            <button 
                key={index} 
                className={`nav-btn ${item.highlight ? 'highlight' : ''}`} 
                onClick={item?.action ? item.action : () => {}}
            >
                {item.label}
                {item.highlight && <span className="shine"></span>}
            </button>
        ))}
    </nav>
  )
}