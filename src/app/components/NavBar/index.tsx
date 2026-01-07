"use client"

import './NavBar.scss'
import React, { useState } from 'react'

interface NavItem {
    label: string;
    action: () => void;
    highlight?: boolean;
}

type NavBarProps = {
    items: NavItem[];
    isMobile?: boolean;
}

export default function NavBar({ items, isMobile = false }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <nav className="mobile-navbar">
        <button 
          className={`burger-btn ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          {items.map((item, index) => (
            <button 
              key={index} 
              className="mobile-nav-btn"
              onClick={() => handleItemClick(item.action)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    );
  }

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